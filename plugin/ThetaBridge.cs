using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using System.Threading;
using BepInEx;
using HarmonyLib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine.EventSystems;

[BepInPlugin("local.theta.agent", "Theta Agent Bridge", "0.3.2")]
public sealed class ThetaBridge : BaseUnityPlugin
{
    const int MaxRequest = 65536;
    static readonly HashSet<string> Actions = new HashSet<string>(StringComparer.OrdinalIgnoreCase) {
        "Up", "Down", "Left", "Right", "Split", "Undo", "Retry", "Tab", "Shift", "Confirm", "Pause", "Grid", "Preview", "Redo"
    };
    static string pulse;
    static int pulseFrame = -1;
    readonly Queue<Job> queue = new Queue<Job>();
    TcpListener listener;
    Thread listenerThread;
    volatile bool running;
    bool busy;
    string token;
    int port;
    Harmony harmony;
    bool previousRunInBackground;

    sealed class Job {
        public JObject Request;
        public JObject Response;
        public readonly ManualResetEvent Done = new ManualResetEvent(false);
        public volatile bool Cancelled;
        public TcpClient Client;
        public DateTime Deadline = DateTime.UtcNow.AddSeconds(15);
    }

    void Awake() {
        try {
            // Unity can create the BepInEx manager during the initial scene load.
            // Explicitly keep its root alive when the title scene replaces it.
            UnityEngine.Object.DontDestroyOnLoad(transform.root.gameObject);
            transform.root.gameObject.hideFlags = HideFlags.HideAndDontSave;
            JObject config = JObject.Parse(File.ReadAllText(Path.Combine(Paths.ConfigPath, "theta-agent.json")));
            token = (string)config["token"];
            port = (int)config["port"];
            if (String.IsNullOrEmpty(token) || token.Length < 32) throw new Exception("Missing bridge authentication token");
            harmony = new Harmony("local.theta.agent.input");
            foreach (string name in new [] { "GetAction", "GetActionActive", "GetActionDown", "GetActionUp" }) {
                MethodInfo original = AccessTools.Method(typeof(InputHandler), name, new [] { typeof(string) });
                if (original == null) throw new Exception("Game input API changed: " + name);
                harmony.Patch(original, prefix: new HarmonyMethod(typeof(ThetaBridge), "InputPrefix"));
            }
            previousRunInBackground = Application.runInBackground;
            Application.runInBackground = true;
            listener = new TcpListener(IPAddress.Loopback, port);
            listener.Start(4);
            running = true;
            listenerThread = new Thread(Listen);
            listenerThread.IsBackground = true;
            listenerThread.Start();
            Logger.LogInfo("Theta bridge listening on 127.0.0.1:" + port);
        } catch (Exception ex) {
            if (harmony != null) harmony.UnpatchSelf();
            Logger.LogError(ex);
            enabled = false;
        }
    }

    static bool InputPrefix(string actionName, ref bool __result) {
        if (pulseFrame == Time.frameCount && String.Equals(pulse, actionName, StringComparison.OrdinalIgnoreCase)) {
            __result = true;
            return false;
        }
        return true;
    }

    static JObject Failure(string code, string message) {
        return new JObject { ["ok"] = false, ["error"] = new JObject { ["code"] = code, ["message"] = message } };
    }

    void Listen() {
        while (running) {
            try {
                using (TcpClient client = listener.AcceptTcpClient()) {
                    client.ReceiveTimeout = 2500;
                    client.SendTimeout = 5000;
                    using (NetworkStream stream = client.GetStream()) {
                        JObject response;
                        try {
                            var bytes = new List<byte>();
                            int b;
                            while ((b = stream.ReadByte()) != -1 && b != 10) {
                                if (bytes.Count >= MaxRequest) throw new Exception("Request too large");
                                bytes.Add((byte)b);
                            }
                            JObject req = JObject.Parse(Encoding.UTF8.GetString(bytes.ToArray()));
                            if ((string)req["token"] != token) response = Failure("unauthorized", "Invalid bridge token");
                            else {
                                bool isBatch = (string)req["method"] == "batch";
                                Job job = new Job { Request = req, Client = client,
                                    Deadline = DateTime.UtcNow.AddSeconds(isBatch ? 45 : 15) };
                                lock (queue) queue.Enqueue(job);
                                if (job.Done.WaitOne(isBatch ? 46000 : 16000)) response = job.Response;
                                else {
                                    job.Cancelled = true;
                                    response = Failure("timeout", "Game did not respond. Inspect state before retrying an action.");
                                }
                            }
                        } catch (Exception ex) { response = Failure("bad_request", ex.Message); }
                        byte[] output = Encoding.UTF8.GetBytes(response.ToString(Formatting.None) + "\n");
                        stream.Write(output, 0, output.Length);
                    }
                }
            } catch (Exception ex) { if (running) Logger.LogWarning("Bridge connection: " + ex.Message); }
        }
    }

    void Update() {
        if (busy) return;
        Job job = null;
        lock (queue) { if (queue.Count > 0) job = queue.Dequeue(); }
        if (job == null) return;
        if (job.Cancelled || DateTime.UtcNow > job.Deadline) {
            job.Response = Failure("expired", "Request expired before execution");
            job.Done.Set();
            return;
        }
        busy = true;
        StartCoroutine(Execute(job));
    }

    IEnumerator Execute(Job job) {
        string method = (string)job.Request["method"];
        JObject args = job.Request["params"] as JObject ?? new JObject();
        if (method == "batch") {
            yield return ExecuteBatch(job, args);
            busy = false;
            yield break;
        }
        JObject result = null;
        float waitSeconds = 0;
        bool screenshot = false;
        bool action = false;
        try {
            switch (method) {
                case "ping": result = new JObject { ["version"] = "0.3.2", ["game"] = Application.productName,
                    ["unity"] = Application.unityVersion, ["pid"] = System.Diagnostics.Process.GetCurrentProcess().Id,
                    ["scene"] = SceneManager.GetActiveScene().name, ["save_path"] = Application.persistentDataPath }; break;
                case "state": result = State((bool?)args["include_map"] ?? true); break;
                case "ui": result = UI(); break;
                case "act":
                    string name = (string)args["action"];
                    if (name == null || !Actions.Contains(name)) throw new ArgumentException("Unknown action");
                    if (IsGameplayAction(name)) {
                        Level level = Level.Instance;
                        bool navigation = name.Equals("Up", StringComparison.OrdinalIgnoreCase) || name.Equals("Down", StringComparison.OrdinalIgnoreCase)
                            || name.Equals("Left", StringComparison.OrdinalIgnoreCase) || name.Equals("Right", StringComparison.OrdinalIgnoreCase)
                            || name.Equals("Tab", StringComparison.OrdinalIgnoreCase) || name.Equals("Shift", StringComparison.OrdinalIgnoreCase);
                        bool menu = level != null && level.um != null && level.um.paused;
                        // The chapter map uses the normal Split (X) input to travel.
                        bool menuInput = navigation || name.Equals("Split", StringComparison.OrdinalIgnoreCase);
                        if ((level == null || !level.inited) && !navigation) throw new InvalidOperationException("No initialized level; use ui/click/confirm first");
                        if (level != null && !(menu && menuInput) && (level.isInputLocking || level.alreadyinoneround || level.isreseting || menu))
                            throw new InvalidOperationException("Level is busy or input is locked; inspect state/UI first");
                    }
                    pulse = name;
                    pulseFrame = Time.frameCount + 1;
                    waitSeconds = 0.2f;
                    action = true;
                    break;
                case "click":
                    int id = (int)args["id"];
                    Button found = null;
                    foreach (Button button in UnityEngine.Object.FindObjectsOfType<Button>())
                        if (button.GetInstanceID() == id) { found = button; break; }
                    if (found == null || !found.IsActive() || !found.IsInteractable()) throw new ArgumentException("Button unavailable; refresh ui");
                    if (EventSystem.current != null) EventSystem.current.SetSelectedGameObject(found.gameObject);
                    found.onClick.Invoke();
                    waitSeconds = 0.25f;
                    action = true;
                    break;
                case "wait":
                    int ms = (int?)args["ms"] ?? 250;
                    if (ms < 0 || ms > 5000) throw new ArgumentException("ms must be 0..5000");
                    waitSeconds = ms / 1000f;
                    break;
                case "screenshot": screenshot = true; break;
                default: throw new ArgumentException("Unknown method: " + method);
            }
        } catch (Exception ex) { job.Response = Failure("operation_failed", ex.GetBaseException().Message); }

        if (job.Response == null) {
            // Let the entire synthetic input frame run, regardless of MonoBehaviour Update order.
            if (action) { yield return null; yield return null; }
            if (waitSeconds > 0) yield return new WaitForSecondsRealtime(waitSeconds);
            if (action) {
                float until = Time.realtimeSinceStartup + 4f;
                while (Time.realtimeSinceStartup < until) {
                    Level lv = Level.Instance;
                    if (lv == null || (!lv.alreadyinoneround && !lv.isreseting)) break;
                    yield return null;
                }
            }
            if (screenshot) yield return new WaitForEndOfFrame();
            try {
                if (screenshot) result = Screenshot((int?)args["max_width"] ?? 1280);
                if (result == null) {
                    result = Summary();
                    if (action) result["dispatched"] = true;
                    if (method == "act") result["action"] = args["action"];
                    if (method == "click") result["button_id"] = args["id"];
                    if (method == "wait") result["waited_ms"] = (int?)args["ms"] ?? 250;
                }
                job.Response = new JObject { ["ok"] = true, ["result"] = result };
            } catch (Exception ex) { job.Response = Failure("operation_failed", ex.GetBaseException().Message); }
        }
        job.Done.Set();
        busy = false;
    }

    static bool IsGameplayAction(string action) {
        return new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "Up", "Down", "Left", "Right", "Split", "Undo", "Retry", "Tab", "Shift", "Redo" }.Contains(action);
    }

    sealed class BatchRun {
        public string[] Actions;
        public int Executed;
        public string StopReason = "finished";
        public string Error;
    }

    IEnumerator ExecuteBatch(Job job, JObject args) {
        BatchRun run = new BatchRun();
        try {
            JArray actions = args["actions"] as JArray;
            if (actions == null || actions.Count < 1 || actions.Count > 50)
                throw new ArgumentException("actions must contain 1..50 action names");
            run.Actions = new string[actions.Count];
            // Validate the entire sequence before scheduling any input.
            for (int i = 0; i < actions.Count; i++) {
                if (actions[i].Type != JTokenType.String || !Actions.Contains((string)actions[i]))
                    throw new ArgumentException("Invalid action at index " + i);
                run.Actions[i] = (string)actions[i];
            }
        } catch (Exception ex) { job.Response = Failure("bad_request", ex.Message); }
        if (job.Response == null) {
            // Explicitly drive the iterator to catch exceptions across yield boundaries.
            IEnumerator steps = BatchSteps(job, run);
            while (true) {
                bool next = false;
                object current = null;
                try { next = steps.MoveNext(); if (next) current = steps.Current; }
                catch (Exception ex) { run.StopReason = "error"; run.Error = ex.GetBaseException().Message; }
                if (!next) break;
                yield return current;
            }
            try {
                JObject result = Summary();
                result["requested"] = run.Actions.Length;
                // Executed means input dispatched, not guaranteed movement or puzzle success.
                result["executed"] = run.Executed;
                result["remaining"] = run.Actions.Length - run.Executed;
                result["stop_reason"] = run.StopReason;
                if (run.Executed > 0) result["last_action"] = run.Actions[run.Executed - 1];
                if (run.Error != null) { result["ok"] = false; result["error"] = run.Error; }
                job.Response = new JObject { ["ok"] = true, ["result"] = result };
            } catch (Exception ex) {
                job.Response = Failure("operation_failed", "Batch dispatched " + run.Executed + " inputs: " + ex.GetBaseException().Message);
            }
        }
        job.Done.Set();
    }

    IEnumerator BatchSteps(Job job, BatchRun run) {
        Level original = Level.Instance;
        int sceneHandle = SceneManager.GetActiveScene().handle;
        string levelId = original == null ? null : original.LevelRealID;
        foreach (string name in run.Actions) {
            string stop = BatchStop(job, original, sceneHandle, levelId, false);
            if (stop != null) { run.StopReason = stop; yield break; }
            pulse = name;
            pulseFrame = Time.frameCount + 1;
            int inputFrame = pulseFrame;
            // Keep exactly one whole input frame, including when identical inputs repeat.
            while (Time.frameCount <= inputFrame) yield return null;
            run.Executed++;
            float settleAfter = Time.realtimeSinceStartup + 0.2f;
            float stopWaiting = Time.realtimeSinceStartup + 4f;
            while (true) {
                stop = BatchStop(job, original, sceneHandle, levelId, true);
                if (stop != null) { run.StopReason = stop; yield break; }
                if (Time.realtimeSinceStartup >= settleAfter && !BatchAnimating(original)) break;
                if (Time.realtimeSinceStartup >= stopWaiting) { run.StopReason = "animation_timeout"; yield break; }
                yield return null;
            }
        }
    }

    static bool BatchAnimating(Level lv) {
        if (lv.alreadyinoneround || lv.isreseting) return true;
        if (lv.timeLines != null) foreach (TimeLine tl in lv.timeLines) {
            if (tl == null || tl.ListDynamic == null) continue;
            foreach (DynamicEntity e in tl.ListDynamic)
                if (e != null && e.Active && !e.AnimCompleted) return true;
        }
        return false;
    }

    static string BatchStop(Job job, Level original, int sceneHandle, string levelId, bool waiting) {
        if (job.Cancelled) return "cancelled";
        // Return partial progress before the batch transport's 46-second response deadline.
        if (DateTime.UtcNow >= job.Deadline.AddSeconds(-2)) return "time_budget";
        try {
            Socket socket = job.Client.Client;
            if (socket.Poll(0, SelectMode.SelectRead) && socket.Available == 0) return "client_disconnected";
        } catch (ObjectDisposedException) { return "client_disconnected"; }
        catch (SocketException) { return "client_disconnected"; }
        if (levelId == null) return "no_level";
        Level lv = Level.Instance;
        if (lv == null || lv != original || lv.LevelRealID != levelId || SceneManager.GetActiveScene().handle != sceneHandle)
            return "level_changed";
        if (!lv.inited) return "not_ready";
        if (GlobalController.Instance != null && GlobalController.Instance.loading) return "loading";
        if (lv.um != null && lv.um.IsPlayingDialog()) return "dialog";
        if (lv.um != null && lv.um.paused) return "paused";
        if (System.Object.Equals(Field(lv, "completed"), true)) return "level_completed";
        if (lv.IsConflicting) return "conflicting";
        if (lv.isLooping) return "looping";
        if (lv.isInputLocking) return "input_locked";
        if (!waiting && BatchAnimating(lv)) return "busy";
        return null;
    }

    static JArray V(Vector2Int p) { return new JArray(p.x, p.y); }
    static object Field(object obj, string name) {
        if (obj == null) return null;
        FieldInfo f = AccessTools.Field(obj.GetType(), name);
        return f == null ? null : f.GetValue(obj);
    }
    static JToken Value(object obj) { return obj == null ? JValue.CreateNull() : JToken.FromObject(obj); }

    // Action receipts must stay small even on the world map or after many splits.
    // Detailed UI, other timelines and entity properties are only read on demand.
    static JObject Summary() {
        var result = new JObject { ["ok"] = true, ["scene"] = SceneManager.GetActiveScene().name };
        Level lv = Level.Instance;
        if (lv == null) { result["level_id"] = null; return result; }
        result["level_id"] = lv.LevelRealID;
        result["busy"] = lv.alreadyinoneround || lv.isreseting;
        result["input_locked"] = lv.isInputLocking;
        result["completed"] = Value(Field(lv, "completed"));
        result["conflicting"] = lv.IsConflicting;
        result["undo_depth"] = lv.stepStack == null ? 0 : lv.stepStack.Count;
        if (lv.um != null) {
            result["paused"] = lv.um.paused;
            result["dialog"] = lv.um.IsPlayingDialog();
            if (lv.um.paused && lv.um.PausedMenu != null)
                result["menu_index"] = Value(Field(lv.um.PausedMenu, "curSelectPauseInstruction"));
        }
        TimeLine tl = lv.CurTimeLine;
        result["current_timeline"] = tl == null ? JValue.CreateNull() : new JValue(tl.UUID);
        var players = new JArray();
        int count = 0;
        if (tl != null && tl.PlayerList != null) foreach (Player p in tl.PlayerList) {
            if (p == null || !p.Active) continue;
            count++;
            if (players.Count < 8) players.Add(new JObject { ["id"] = p.EID, ["pos"] = V(p.GetAxis()) });
        }
        result["players"] = players;
        result["player_count"] = count;
        return result;
    }

    static JObject State(bool includeMap) {
        Level lv = Level.Instance;
        var result = new JObject { ["scene"] = SceneManager.GetActiveScene().name, ["frame"] = Time.frameCount,
            ["screen"] = new JArray(Screen.width, Screen.height), ["ui"] = UI() };
        if (lv == null) { result["level"] = null; return result; }
        var level = new JObject {
            ["id"] = lv.LevelRealID, ["world"] = lv.world, ["initialized"] = lv.inited,
            ["input_locked"] = lv.isInputLocking, ["busy"] = lv.alreadyinoneround || lv.isreseting,
            ["completed"] = Value(Field(lv, "completed")), ["conflicting"] = lv.IsConflicting,
            ["looping"] = lv.isLooping, ["undo_depth"] = lv.stepStack == null ? 0 : lv.stepStack.Count,
            ["current_timeline"] = lv.CurTimeLine == null ? JValue.CreateNull() : new JValue(lv.CurTimeLine.UUID),
            ["instructions"] = lv.CurLevelInstructions == null ? "" : lv.CurLevelInstructions.ToCharString(),
            ["goals"] = lv.GoalPoints == null ? new JArray() : new JArray(lv.GoalPoints.ConvertAll<JToken>(p => V(p)))
        };
        if (lv.um != null) {
            level["paused"] = lv.um.paused;
            level["dialog"] = lv.um.IsPlayingDialog();
            level["dialog_index"] = lv.um.DialogIndex;
        }
        var timelines = new JArray();
        if (lv.timeLines != null) foreach (TimeLine tl in lv.timeLines) {
            if (tl == null) continue;
            Vector3Int axis;
            lv.timeLines.GetAxis(tl, out axis);
            var line = new JObject { ["id"] = tl.UUID, ["axis"] = new JArray(axis.x, axis.y, axis.z),
                ["time"] = tl.LocalTime, ["size"] = V(tl.MapSize), ["min_anchor"] = V(tl.MinAnchor),
                ["looping"] = tl.isLooping, ["split_locked"] = tl.SplitLock,
                ["parent"] = tl.parent == null ? JValue.CreateNull() : new JValue(tl.parent.UUID) };
            var entities = new JArray();
            if (tl.ListDynamic != null) foreach (DynamicEntity e in tl.ListDynamic) if (e != null) entities.Add(EntityJSON(e));
            line["entities"] = entities;
            if (includeMap) {
                var tiles = new JArray();
                if (tl.MapBase != null) foreach (var pair in tl.MapBase) if (pair.Value != null) tiles.Add(EntityJSON(pair.Value));
                line["tiles"] = tiles;
            }
            timelines.Add(line);
        }
        level["timelines"] = timelines;
        result["level"] = level;
        return result;
    }

    static JObject EntityJSON(Entity e) {
        var obj = new JObject { ["type"] = e.block_type.ToString(), ["class"] = e.GetType().Name,
            ["pos"] = V(e.GetAxis()), ["active"] = e.Active, ["floor"] = e.floor,
            ["pushable"] = e.Pushable, ["blockable"] = e.Blockable };
        DynamicEntity d = e as DynamicEntity;
        if (d != null) {
            obj["id"] = d.EID;
            obj["face"] = V(d.Face);
            obj["properties"] = d.properties == null ? new JObject() : JObject.FromObject(d.properties);
            obj["anim_completed"] = d.AnimCompleted;
        }
        // Export scalar puzzle-specific fields (gate colors, entry targets, etc.), never Unity object graphs.
        var details = new JObject();
        foreach (FieldInfo f in e.GetType().GetFields(BindingFlags.Instance | BindingFlags.Public)) {
            if (f.DeclaringType == typeof(Entity) || f.DeclaringType == typeof(DynamicEntity)) continue;
            Type type = f.FieldType;
            if (type == typeof(string) || type == typeof(bool) || type == typeof(int) || type.IsEnum) {
                object val = f.GetValue(e);
                details[f.Name] = type.IsEnum ? new JValue(val.ToString()) : Value(val);
            }
        }
        obj["details"] = details;
        return obj;
    }

    static string ObjectPath(Transform t) {
        string path = t.name;
        while (t.parent != null) { t = t.parent; path = t.name + "/" + path; }
        return path;
    }
    static JObject UI() {
        var buttons = new JArray();
        foreach (Button b in UnityEngine.Object.FindObjectsOfType<Button>()) {
            if (!b.IsActive()) continue;
            var labels = new List<string>();
            foreach (Text t in b.GetComponentsInChildren<Text>()) if (!String.IsNullOrEmpty(t.text)) labels.Add(t.text);
            foreach (TMPro.TMP_Text t in b.GetComponentsInChildren<TMPro.TMP_Text>()) if (!String.IsNullOrEmpty(t.text)) labels.Add(t.text);
            buttons.Add(new JObject { ["id"] = b.GetInstanceID(), ["path"] = ObjectPath(b.transform),
                ["label"] = String.Join(" | ", labels.ToArray()), ["interactable"] = b.IsInteractable() });
        }
        var texts = new JArray();
        foreach (Text t in UnityEngine.Object.FindObjectsOfType<Text>())
            if (t.isActiveAndEnabled && !String.IsNullOrWhiteSpace(t.text)) texts.Add(new JObject { ["path"] = ObjectPath(t.transform), ["text"] = t.text });
        foreach (TMPro.TMP_Text t in UnityEngine.Object.FindObjectsOfType<TMPro.TMP_Text>())
            if (t.isActiveAndEnabled && !String.IsNullOrWhiteSpace(t.text)) texts.Add(new JObject { ["path"] = ObjectPath(t.transform), ["text"] = t.text });
        GameObject selected = EventSystem.current == null ? null : EventSystem.current.currentSelectedGameObject;
        var result = new JObject { ["buttons"] = buttons, ["texts"] = texts, ["selected"] = selected == null ? null : ObjectPath(selected.transform) };
        Level lv = Level.Instance;
        if (lv != null && lv.um != null && lv.um.paused && lv.um.PausedMenu != null) {
            PausedMenu menu = lv.um.PausedMenu;
            var entries = new JArray();
            for (int i = 0; i < menu.PauseInstructions.Count; i++) {
                PausedInstruction entry = menu.PauseInstructions[i];
                Text label = entry == null ? null : entry.GetComponent<Text>();
                entries.Add(new JObject { ["index"] = i, ["label"] = label == null ? "" : label.text });
            }
            result["pause_menu"] = new JObject { ["mode"] = menu.ShowMode,
                ["selected_index"] = Value(Field(menu, "curSelectPauseInstruction")), ["entries"] = entries };
        }
        return result;
    }

    static JObject Screenshot(int maxWidth) {
        if (maxWidth < 320 || maxWidth > 3840) throw new ArgumentException("max_width must be 320..3840");
        Texture2D texture = ScreenCapture.CaptureScreenshotAsTexture();
        try {
            if (texture.width > maxWidth) {
                int height = Math.Max(1, texture.height * maxWidth / texture.width);
                RenderTexture rt = RenderTexture.GetTemporary(maxWidth, height, 0);
                RenderTexture old = RenderTexture.active;
                try {
                    Graphics.Blit(texture, rt);
                    RenderTexture.active = rt;
                    Texture2D small = new Texture2D(maxWidth, height, TextureFormat.RGB24, false);
                    small.ReadPixels(new Rect(0, 0, maxWidth, height), 0, 0);
                    small.Apply();
                    UnityEngine.Object.Destroy(texture);
                    texture = small;
                } finally { RenderTexture.active = old; RenderTexture.ReleaseTemporary(rt); }
            }
            return new JObject { ["mimeType"] = "image/png", ["width"] = texture.width, ["height"] = texture.height,
                ["data"] = Convert.ToBase64String(ImageConversion.EncodeToPNG(texture)) };
        } finally { UnityEngine.Object.Destroy(texture); }
    }

    void OnDestroy() {
        Logger.LogInfo("Theta bridge shutting down (scene=" + SceneManager.GetActiveScene().name + ")");
        running = false;
        if (listener != null) listener.Stop();
        if (harmony != null) harmony.UnpatchSelf();
        Application.runInBackground = previousRunInBackground;
    }
}
