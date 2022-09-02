import imp
import importlib
import io
import os
import sys
import threading
import time
import traceback
import zipfile

import sublime
import sublime_api


api_ready = False

deferred_plugin_loadeds = []

application_command_classes = []
window_command_classes = []
text_command_classes = []

view_event_listener_classes = []
view_event_listeners = {}

all_command_classes = [
    application_command_classes,
    window_command_classes,
    text_command_classes]

all_callbacks = {
    'on_init': [],
    'on_new': [],
    'on_clone': [],
    'on_load': [],
    'on_revert': [],
    'on_reload': [],
    'on_pre_close': [],
    'on_close': [],
    'on_pre_save': [],
    'on_post_save': [],
    'on_pre_move': [],
    'on_post_move': [],
    'on_modified': [],
    'on_selection_modified': [],
    'on_activated': [],
    'on_deactivated': [],
    'on_query_context': [],
    'on_query_completions': [],
    'on_hover': [],
    'on_text_command': [],
    'on_window_command': [],
    'on_post_text_command': [],
    'on_post_window_command': [],
    'on_modified_async': [],
    'on_selection_modified_async': [],
    'on_pre_save_async': [],
    'on_post_save_async': [],
    'on_post_move_async': [],
    'on_activated_async': [],
    'on_deactivated_async': [],
    'on_new_async': [],
    'on_load_async': [],
    'on_revert_async': [],
    'on_reload_async': [],
    'on_clone_async': [],
    'on_new_buffer': [],
    'on_new_buffer_async': [],
    'on_associate_buffer': [],
    'on_associate_buffer_async': [],
    'on_close_buffer': [],
    'on_close_buffer_async': [],
    'on_new_project': [],
    'on_new_project_async': [],
    'on_load_project': [],
    'on_load_project_async': [],
    'on_pre_save_project': [],
    'on_post_save_project': [],
    'on_post_save_project_async': [],
    'on_pre_close_project': [],
    'on_new_window': [],
    'on_new_window_async': [],
    'on_pre_close_window': [],
    'on_exit': [],
}

pending_on_activated_async_lock = threading.Lock()

pending_on_activated_async_callbacks = {
    'EventListener': [],
    'ViewEventListener': [],
}

view_event_listener_excluded_callbacks = {
    'on_clone',
    'on_clone_async',
    'on_exit',
    'on_init',
    'on_load_project',
    'on_load_project_async',
    'on_new',
    'on_new_async',
    'on_new_buffer',
    'on_new_buffer_async',
    'on_associate_buffer',
    'on_associate_buffer_async',
    'on_close_buffer',
    'on_close_buffer_async',
    'on_new_project',
    'on_new_project_async',
    'on_new_window',
    'on_new_window_async',
    'on_post_save_project',
    'on_post_save_project_async',
    'on_post_window_command',
    'on_pre_close_project',
    'on_pre_close_window',
    'on_pre_save_project',
    'on_window_command',
}

text_change_listener_classes = []
text_change_listener_callbacks = {
    'on_text_changed',
    'on_text_changed_async',
    'on_revert',
    'on_revert_async',
    'on_reload',
    'on_reload_async',
}
text_change_listeners = {}

profile = {}


def add_profiling(event_handler):
    """
    Decorator to measure blocking event handler methods. Also prevents
    exceptions from interrupting other events handlers.

    :param event_handler:
        The event handler method - must be an unbound method

    :return:
        The decorated method
    """

    def profiler(*args):
        global profile
        t0 = time.time()
        try:
            return event_handler(*args)
        except (Exception) as e:
            # All this to include stack frames before the call to
            # event_handler() above
            tb = traceback.extract_stack()[:-1]
            tb += traceback.extract_tb(e.__traceback__)
            out = ["Traceback (most recent call last):\n"]
            out += traceback.format_list(tb)
            out += traceback.format_exception_only(type(e), e)
            print("".join(out), end="")
        finally:
            elapsed = time.time() - t0
            mod = event_handler.__module__
            p = profile.setdefault(event_handler.__name__, {})
            p.setdefault(mod, Summary()).record(elapsed)

    # Make the method look like the original for introspection
    profiler.__doc__ = event_handler.__doc__
    profiler.__name__ = event_handler.__name__
    profiler.__module__ = event_handler.__module__
    # Follow the pattern of decorators like @classmethod and @staticmethod
    profiler.__func__ = event_handler
    return profiler


def trap_exceptions(event_handler):
    """
    Decorator to prevent exceptions from interrupting other events handlers.

    :param event_handler:
        The event handler method - must be an unbound method

    :return:
        The decorated method
    """

    def exception_handler(*args):
        try:
            return event_handler(*args)
        except (Exception) as e:
            # All this to include stack frames before the call to
            # event_handler() above
            tb = traceback.extract_stack()[:-1]
            tb += traceback.extract_tb(e.__traceback__)
            out = ["Traceback (most recent call last):\n"]
            out += traceback.format_list(tb)
            out += traceback.format_exception_only(type(e), e)
            print("".join(out), end="")

    # Make the method look like the original for introspection
    exception_handler.__doc__ = event_handler.__doc__
    exception_handler.__name__ = event_handler.__name__
    exception_handler.__module__ = event_handler.__module__
    event_handler.__name__ = '_wrapped_%s' % event_handler.__name__
    # Follow the pattern of decorators like @classmethod and @staticmethod
    exception_handler.__func__ = event_handler
    return exception_handler


def decorate_handler(cls, method_name):
    """
    Decorates an event handler method with exception trapping, and in the case
    of blocking calls, profiling.

    :param cls:
        The class object to decorate

    :param method_name:
        A unicode string of the name of the method to decorate
    """

    # We have to use __dict__ rather than getattr(), otherwise the function
    # is passed through decorators, and we can't detect @classmethod and
    # @staticmethod
    method = cls.__dict__[method_name]
    if method_name.endswith('_async'):
        wrapper = trap_exceptions
    else:
        wrapper = add_profiling
    if isinstance(method, staticmethod):
        wrapped = staticmethod(wrapper(method.__func__))
    elif isinstance(method, classmethod):
        wrapped = classmethod(wrapper(method.__func__))
    else:
        wrapped = wrapper(method)
    setattr(cls, method_name, wrapped)


def unload_module(module):
    if "plugin_unloaded" in module.__dict__:
        try:
            module.plugin_unloaded()
        except:
            traceback.print_exc()

    # Check unload_handler too, for backwards compat
    elif "unload_handler" in module.__dict__:
        try:
            module.unload_handler()
        except:
            traceback.print_exc()

    # Unload the old plugins
    if "__plugins__" in module.__dict__:
        for view_id, listener_instances in view_event_listeners.items():
            for vel in listener_instances[:]:
                if vel.__class__ in module.__plugins__:
                    listener_instances.remove(vel)

        for buffer_id, listener_instances in text_change_listeners.items():
            for tcl in listener_instances[:]:
                if tcl.__class__ in module.__plugins__:
                    tcl.detach()
                    listener_instances.remove(tcl)

        for p in module.__plugins__:
            for cmd_cls_list in all_command_classes:
                try:
                    cmd_cls_list.remove(p)
                except ValueError:
                    pass
            for c in all_callbacks.values():
                try:
                    c.remove(p)
                except ValueError:
                    pass

            try:
                view_event_listener_classes.remove(p)
            except ValueError:
                pass

            try:
                text_change_listener_classes.remove(p)
            except ValueError:
                pass


def unload_plugin(modulename):
    print("unloading python 3.3 plugin %s" % modulename)

    was_loaded = modulename in sys.modules
    if was_loaded:
        m = sys.modules[modulename]
        unload_module(m)
        del sys.modules[modulename]


def reload_plugin(modulename):
    print("reloading python 3.3 plugin %s" % modulename)

    if modulename in sys.modules:
        m = sys.modules[modulename]
        unload_module(m)
        m = imp.reload(m)
    else:
        m = importlib.import_module(modulename)

    load_module(m)


def load_module(m):
    module_plugins = []
    on_activated_targets = []
    vel_on_activated_classes = []
    el_on_activated_async_targets = []
    vel_on_activated_async_targets = []
    module_view_event_listener_classes = []
    module_text_change_listener_classes = []

    for type_name in dir(m):
        try:
            t = m.__dict__[type_name]
            if t.__bases__:
                is_plugin = False
                if issubclass(t, ApplicationCommand) and t is not ApplicationCommand:
                    application_command_classes.append(t)
                    is_plugin = True
                if issubclass(t, WindowCommand) and t is not WindowCommand:
                    window_command_classes.append(t)
                    is_plugin = True
                if issubclass(t, TextCommand) and t is not TextCommand:
                    text_command_classes.append(t)
                    is_plugin = True

                if is_plugin:
                    module_plugins.append(t)

                if issubclass(t, EventListener) and t is not EventListener:
                    for method_name, _ in all_callbacks.items():
                        if method_name in dir(t):
                            decorate_handler(t, method_name)

                    obj = t()

                    for method_name, listeners in all_callbacks.items():
                        if method_name in dir(t):
                            listeners.append(obj)

                    if "on_activated" in dir(obj):
                        on_activated_targets.append(obj)

                    if "on_activated_async" in dir(obj):
                        el_on_activated_async_targets.append(obj)

                    module_plugins.append(obj)

                if issubclass(t, ViewEventListener) and t is not ViewEventListener:
                    for method_name, _ in all_callbacks.items():
                        if method_name in view_event_listener_excluded_callbacks:
                            continue
                        if method_name in dir(t):
                            decorate_handler(t, method_name)
                    view_event_listener_classes.append(t)
                    module_view_event_listener_classes.append(t)
                    if "on_activated" in dir(t):
                        vel_on_activated_classes.append(t)
                    if "on_activated_async" in dir(t):
                        vel_on_activated_async_targets.append(t)
                    module_plugins.append(t)

                if issubclass(t, TextChangeListener) and t is not TextChangeListener:
                    for name in text_change_listener_callbacks:
                        if name in dir(t):
                            decorate_handler(t, name)

                    module_plugins.append(t)
                    text_change_listener_classes.append(t)
                    module_text_change_listener_classes.append(t)

        except AttributeError:
            pass

    if el_on_activated_async_targets or vel_on_activated_async_targets:
        with pending_on_activated_async_lock:
            pending_on_activated_async_callbacks['EventListener'].extend(
                el_on_activated_async_targets
            )
            pending_on_activated_async_callbacks['ViewEventListener'].extend(
                vel_on_activated_async_targets
            )

    if len(module_plugins) > 0:
        m.__plugins__ = module_plugins

    if api_ready:
        if "plugin_loaded" in m.__dict__:
            try:
                m.plugin_loaded()
            except:
                traceback.print_exc()

        # Create any require ViewEventListener objects
        if len(module_view_event_listener_classes) > 0:
            for w in sublime.windows():
                for v in w.views(include_transient=True):
                    create_view_event_listeners(
                        module_view_event_listener_classes, v)

        # Create any required TextChangeListener objects
        if len(module_text_change_listener_classes) > 0:
            for b in sublime._buffers():
                attach_buffer(b)

        on_init(m.__name__)

        # Synthesize any required on_activated calls
        w = sublime.active_window()
        if w:
            v = w.active_view()
            if v:
                for el in on_activated_targets:
                    try:
                        el.on_activated(v)
                    except:
                        traceback.print_exc()

                for vel_cls in vel_on_activated_classes:
                    vel = find_view_event_listener(v, vel_cls)
                    if not vel:
                        continue
                    try:
                        vel.on_activated()
                    except:
                        traceback.print_exc()

    elif "plugin_loaded" in m.__dict__:
        deferred_plugin_loadeds.append(m.plugin_loaded)


def synthesize_on_activated_async():
    if not api_ready:
        return

    with pending_on_activated_async_lock:
        els = pending_on_activated_async_callbacks['EventListener']
        vels = pending_on_activated_async_callbacks['ViewEventListener']
        pending_on_activated_async_callbacks['EventListener'] = []
        pending_on_activated_async_callbacks['ViewEventListener'] = []

    for el in els:
        w = sublime.active_window()
        if not w:
            continue
        v = w.active_view()
        if not v:
            continue
        el.on_activated_async(v)

    for vel_cls in vels:
        w = sublime.active_window()
        if not w:
            continue
        v = w.active_view()
        if not v:
            continue
        vel = find_view_event_listener(v, vel_cls)
        if not vel:
            continue
        vel.on_activated_async()


def _instantiation_error(cls, e):
    rex = RuntimeError(
        "unable to instantiate "
        "'%s.%s'" % (cls.__module__, cls.__name__)
    )
    rex.__cause__ = e
    traceback.print_exception(rex.__class__, rex, None)


def notify_application_commands():
    sublime_api.notify_application_commands(create_application_commands())


def create_application_commands():
    cmds = []
    for cls in application_command_classes:
        try:
            o = cls()
            cmds.append((o, o.name()))
        except Exception as e:
            _instantiation_error(cls, e)
    return cmds


def create_window_commands(window_id):
    window = sublime.Window(window_id)
    cmds = []
    for cls in window_command_classes:
        try:
            o = cls(window)
            cmds.append((o, o.name()))
        except Exception as e:
            _instantiation_error(cls, e)
    return cmds


def create_text_commands(view_id):
    view = sublime.View(view_id)
    cmds = []
    for cls in text_command_classes:
        try:
            o = cls(view)
            cmds.append((o, o.name()))
        except Exception as e:
            _instantiation_error(cls, e)
    return cmds


def on_api_ready():
    global api_ready
    api_ready = True

    for plc in deferred_plugin_loadeds:
        try:
            plc()
        except:
            traceback.print_exc()
    deferred_plugin_loadeds.clear()

    # Create ViewEventListener instances
    if len(view_event_listener_classes) > 0:
        for w in sublime.windows():
            for v in w.views(include_transient=True):
                attach_view(v)

    if len(text_change_listener_classes) > 0:
        for b in sublime._buffers():
            attach_buffer(b)

    def init():
        on_init(None)

        # Synthesize an on_activated call
        w = sublime.active_window()
        if w:
            view_id = sublime_api.window_active_view(w.window_id)
            if view_id != 0:
                on_activated(view_id)

    sublime.set_timeout(init)


def is_view_event_listener_applicable(cls, view):
    if not cls.is_applicable(view.settings()):
        return False

    if cls.applies_to_primary_view_only() and not view.is_primary():
        return False

    return True


def create_view_event_listeners(classes, view):
    if len(classes) > 0:
        if view.view_id not in view_event_listeners:
            view_event_listeners[view.view_id] = []

        for c in classes:
            if is_view_event_listener_applicable(c, view):
                view_event_listeners[view.view_id].append(c(view))


def check_view_event_listeners(view):
    if len(view_event_listener_classes) > 0:
        if view.view_id not in view_event_listeners:
            view_event_listeners[view.view_id] = []

        listeners = view_event_listeners[view.view_id]

        for cls in view_event_listener_classes:
            found = False
            instance = None
            for l in listeners:
                if l.__class__ == cls:
                    found = True
                    instance = l
                    break

            want = is_view_event_listener_applicable(cls, view)

            if want and not found:
                listeners.append(cls(view))
            elif found and not want:
                listeners.remove(instance)


def attach_view(view):
    if isinstance(view, int):
        view = sublime.View(view)

    check_view_event_listeners(view)

    view.settings().add_on_change(
        "check_view_event_listeners",
        lambda: check_view_event_listeners(view))


check_all_view_event_listeners_scheduled = False


def check_all_view_event_listeners():
    global check_all_view_event_listeners_scheduled
    check_all_view_event_listeners_scheduled = False
    for w in sublime.windows():
        for v in w.views(include_transient=True):
            check_view_event_listeners(v)


def detach_view(view):
    if view.view_id in view_event_listeners:
        del view_event_listeners[view.view_id]

    # A view has closed, which implies 'is_primary' may have changed, so see if
    # any of the ViewEventListener classes need to be created.
    # Call this in a timeout, as 'view' will still be reporting itself as a
    # primary at this stage
    global check_all_view_event_listeners_scheduled
    if not check_all_view_event_listeners_scheduled:
        check_all_view_event_listeners_scheduled = True
        sublime.set_timeout(check_all_view_event_listeners)


def find_view_event_listener(view, cls):
    if view.view_id in view_event_listeners:
        for vel in view_event_listeners[view.view_id]:
            if vel.__class__ == cls:
                return vel
    return None


def attach_buffer(buf):
    for cls in text_change_listener_classes:
        if cls.is_applicable(buf):
            cls().attach(buf)


def check_text_change_listeners(buf):
    if len(text_change_listener_classes) > 0:
        if buf.buffer_id not in text_change_listeners:
            text_change_listeners[buf.buffer_id] = []

        listeners = text_change_listeners[buf.buffer_id]

        for cls in text_change_listener_classes:
            found = False
            instance = None
            for l in listeners:
                if l.__class__ == cls:
                    found = True
                    instance = l
                    break

            want = cls.is_applicable(buf)

            if want and not found:
                cls().attach(buf)
            elif found and not want:
                instance.detach()


def detach_buffer(buf):
    if buf.buffer_id in text_change_listeners:
        listeners = text_change_listeners[buf.buffer_id]
        for tcl in listeners:
            tcl.detach()
        del text_change_listeners[buf.buffer_id]


def plugin_module_for_obj(obj):
    # Since objects in plugins may be defined deep in a sub-module, if we want
    # to filter by a module, we must make sure we are only looking at the
    # first two module labels
    cm = obj.__class__.__module__
    if cm.count('.') > 2:
        cm = '.'.join(cm.split('.', 2)[0:2])
    return cm


def el_callbacks(name, listener_only=False):
    for el in all_callbacks[name]:
        yield el if listener_only else getattr(el, name)


def vel_callbacks(v, name, listener_only=False):
    for vel in view_event_listeners.get(v.view_id, []):
        if not hasattr(vel, name):
            continue
        yield vel if listener_only else getattr(vel, name)


def run_view_callbacks(name, view_id, *args, el_only=False):
    v = sublime.View(view_id)

    for callback in el_callbacks(name):
        callback(v, *args)

    if el_only:
        return

    for callback in vel_callbacks(v, name):
        callback(*args)


def run_window_callbacks(name, window_id, *args):
    w = sublime.Window(window_id)

    for callback in el_callbacks(name):
        callback(w, *args)


def on_init(module):
    """
    Trigger the on_init() methods on EventListener and ViewEventListener
    objects. This is method that allows event listeners to run something
    once per view, even if the view is done loading before the listener
    starts listening.

    :param module:
        A unicode string of the name of a plugin module to filter listeners by
    """

    buffers = sublime._buffers()

    for listener in el_callbacks('on_new_buffer', listener_only=True):
        if module is not None and plugin_module_for_obj(listener) != module:
            continue
        for b in buffers:
            listener.on_new_buffer(b)

    for listener in el_callbacks('on_new_buffer_async', listener_only=True):
        if module is not None and plugin_module_for_obj(listener) != module:
            continue

        def on_new_buffers_async(bufs=buffers, l=listener):
            for b in bufs:
                l.on_new_buffer_async(b)
        sublime.set_timeout_async(on_new_buffers_async, 0)

    views = []

    for w in sublime.windows():
        for v in w.views(include_transient=True):
            if not v.is_loading():
                views.append(v)

    for listener in el_callbacks('on_init', listener_only=True):
        if module is not None and plugin_module_for_obj(listener) != module:
            continue
        listener.on_init(views)

    for v in views:
        for listener in vel_callbacks(v, 'on_init', listener_only=True):
            if module is not None and plugin_module_for_obj(listener) != module:
                continue
            listener.on_init()


def on_new(view_id):
    run_view_callbacks('on_new', view_id, el_only=True)


def on_new_async(view_id):
    run_view_callbacks('on_new_async', view_id, el_only=True)


def on_new_buffer(buffer_id):
    buf = sublime.Buffer(buffer_id)

    attach_buffer(buf)

    for callback in el_callbacks('on_new_buffer'):
        callback(buf)


def on_new_buffer_async(buffer_id):
    buf = sublime.Buffer(buffer_id)

    for callback in el_callbacks('on_new_buffer_async'):
        callback(buf)


def on_associate_buffer(buffer_id):
    buf = sublime.Buffer(buffer_id)

    check_text_change_listeners(buf)

    for callback in el_callbacks('on_associate_buffer'):
        callback(buf)


def on_associate_buffer_async(buffer_id):
    buf = sublime.Buffer(buffer_id)

    for callback in el_callbacks('on_associate_buffer_async'):
        callback(buf)


def on_close_buffer(buffer_id):
    buf = sublime.Buffer(buffer_id)

    detach_buffer(buf)

    for callback in el_callbacks('on_close_buffer'):
        callback(buf)


def on_close_buffer_async(buffer_id):
    buf = sublime.Buffer(buffer_id)

    for callback in el_callbacks('on_close_buffer_async'):
        callback(buf)


def on_clone(view_id):
    run_view_callbacks('on_clone', view_id, el_only=True)


def on_clone_async(view_id):
    run_view_callbacks('on_clone_async', view_id, el_only=True)


class Summary():
    def __init__(self):
        self.max = 0.0
        self.sum = 0.0
        self.count = 0

    def record(self, x):
        self.count += 1
        self.sum += x
        self.max = max(self.max, x)


def get_profiling_data():
    global profile
    out = []
    for event in profile:
        data = profile[event]
        for plugin in data:
            s = data[plugin]
            out.append((event, plugin, s.count, s.max, s.sum))
    return out


def on_load(view_id):
    run_view_callbacks('on_load', view_id)


def on_load_async(view_id):
    run_view_callbacks('on_load_async', view_id)


def on_revert(view_id):
    run_view_callbacks('on_revert', view_id)


def on_revert_async(view_id):
    run_view_callbacks('on_revert_async', view_id)


def on_reload(view_id):
    run_view_callbacks('on_reload', view_id)


def on_reload_async(view_id):
    run_view_callbacks('on_reload_async', view_id)


def on_pre_close(view_id):
    run_view_callbacks('on_pre_close', view_id)


def on_close(view_id):
    v = sublime.View(view_id)
    for callback in vel_callbacks(v, 'on_close'):
        callback()
    detach_view(v)
    for callback in el_callbacks('on_close'):
        callback(v)


def on_pre_save(view_id):
    run_view_callbacks('on_pre_save', view_id)


def on_pre_save_async(view_id):
    run_view_callbacks('on_pre_save_async', view_id)


def on_post_save(view_id):
    run_view_callbacks('on_post_save', view_id)


def on_post_save_async(view_id):
    run_view_callbacks('on_post_save_async', view_id)


def on_pre_move(view_id):
    run_view_callbacks('on_pre_move', view_id)


def on_post_move(view_id):
    run_view_callbacks('on_post_move', view_id)


def on_post_move_async(view_id):
    run_view_callbacks('on_post_move_async', view_id)


def on_modified(view_id):
    run_view_callbacks('on_modified', view_id)


def on_modified_async(view_id):
    run_view_callbacks('on_modified_async', view_id)


def on_selection_modified(view_id):
    run_view_callbacks('on_selection_modified', view_id)


def on_selection_modified_async(view_id):
    run_view_callbacks('on_selection_modified_async', view_id)


def on_activated(view_id):
    run_view_callbacks('on_activated', view_id)


def on_activated_async(view_id):
    run_view_callbacks('on_activated_async', view_id)


def on_deactivated(view_id):
    run_view_callbacks('on_deactivated', view_id)


def on_deactivated_async(view_id):
    run_view_callbacks('on_deactivated_async', view_id)


def on_query_context(view_id, key, operator, operand, match_all):
    v = sublime.View(view_id)
    for callback in el_callbacks('on_query_context'):
        val = callback(v, key, operator, operand, match_all)
        if val:
            return True
    for callback in vel_callbacks(v, 'on_query_context'):
        val = callback(key, operator, operand, match_all)
        if val:
            return True
    return False


def normalise_completion(c):
    def split_trigger(trigger):
        idx = trigger.find("\t")
        if idx < 0:
            return (trigger, "")
        else:
            return (trigger[0:idx], trigger[idx + 1:])

    if not isinstance(c, sublime.CompletionItem):
        if isinstance(c, str):
            trigger, annotation = split_trigger(c)
            c = sublime.CompletionItem(trigger, annotation)
        elif len(c) == 1:
            trigger, annotation = split_trigger(c[0])
            c = sublime.CompletionItem(trigger, annotation)
        elif len(c) == 2:
            trigger, annotation = split_trigger(c[0])
            c = sublime.CompletionItem.snippet_completion(
                trigger,
                c[1],
                annotation,
                kind=sublime.KIND_AMBIGUOUS
            )
        elif len(c) == 3:
            trigger, annotation = split_trigger(c[0])
            c = sublime.CompletionItem.snippet_completion(
                trigger,
                c[2],
                annotation,
                kind=sublime.KIND_AMBIGUOUS
            )
        else:
            c = sublime.CompletionItem("")

    kind, kind_letter, kind_name = c.kind

    letter = 0
    if isinstance(kind_letter, str) and kind_letter != '':
        letter = ord(kind_letter)
    return (c.trigger, c.annotation, c.details, c.completion, kind_name, letter, c.completion_format, c.flags, kind)


class MultiCompletionList():
    def __init__(self, num_completion_lists, view_id, req_id):
        self.remaining_calls = num_completion_lists
        self.view_id = view_id
        self.req_id = req_id
        self.completions = []
        self.flags = 0

    def completions_ready(self, completions, flags):
        self.completions += [normalise_completion(c) for c in completions]
        self.flags |= flags
        self.remaining_calls -= 1

        if self.remaining_calls == 0:
            sublime_api.view_set_completions(
                self.view_id, self.req_id, (self.completions, self.flags))


def on_query_completions(view_id, req_id, prefix, locations):
    v = sublime.View(view_id)

    completion_lists = []

    def norm_res(res):
        if isinstance(res, tuple):
            completion_lists.append(sublime.CompletionList(res[0], flags=res[1]))
        elif isinstance(res, list):
            completion_lists.append(sublime.CompletionList(res))
        elif isinstance(res, sublime.CompletionList):
            completion_lists.append(res)

    for callback in el_callbacks('on_query_completions'):
        norm_res(callback(v, prefix, locations))

    for callback in vel_callbacks(v, 'on_query_completions'):
        norm_res(callback(prefix, locations))

    if not completion_lists:
        completion_lists = [sublime.CompletionList([])]

    mlist = MultiCompletionList(len(completion_lists), view_id, req_id)
    for cl in completion_lists:
        cl._set_target(mlist)


def on_hover(view_id, point, hover_zone):
    run_view_callbacks('on_hover', view_id, point, hover_zone)


def on_text_command(view_id, name, args):
    v = sublime.View(view_id)

    for callback in vel_callbacks(v, 'on_text_command'):
        res = callback(name, args)
        if isinstance(res, tuple):
            return res
        if res:
            return (res, None)

    for callback in el_callbacks('on_text_command'):
        res = callback(v, name, args)
        if isinstance(res, tuple):
            return res
        if res:
            return (res, None)

    return ("", None)


def on_window_command(window_id, name, args):
    w = sublime.Window(window_id)
    for callback in el_callbacks('on_window_command'):
        res = callback(w, name, args)
        if isinstance(res, tuple):
            return res
        if res:
            return (res, None)

    return ("", None)


def on_post_text_command(view_id, name, args):
    run_view_callbacks('on_post_text_command', view_id, name, args)


def on_post_window_command(window_id, name, args):
    run_window_callbacks('on_post_window_command', window_id, name, args)


def on_new_project(window_id):
    run_window_callbacks('on_new_project', window_id)


def on_new_project_async(window_id):
    run_window_callbacks('on_new_project_async', window_id)


def on_load_project(window_id):
    run_window_callbacks('on_load_project', window_id)


def on_load_project_async(window_id):
    run_window_callbacks('on_load_project_async', window_id)


def on_pre_save_project(window_id):
    run_window_callbacks('on_pre_save_project', window_id)


def on_post_save_project(window_id):
    run_window_callbacks('on_post_save_project', window_id)


def on_post_save_project_async(window_id):
    run_window_callbacks('on_post_save_project_async', window_id)


def on_pre_close_project(window_id):
    run_window_callbacks('on_pre_close_project', window_id)


def on_new_window(window_id):
    run_window_callbacks('on_new_window', window_id)


def on_new_window_async(window_id):
    run_window_callbacks('on_new_window_async', window_id)


def on_pre_close_window(window_id):
    run_window_callbacks('on_pre_close_window', window_id)


def on_exit(log_path):
    # on_exit() is called once the API it shutdown, which means that stdout
    # will not be visible for debugging. Thus we write to a log file.
    stdout = io.StringIO()
    sys.stdout = stdout
    sys.stderr = stdout

    for callback in el_callbacks('on_exit'):
        callback()

    if len(stdout.getvalue()):
        with open(log_path, "w", encoding="utf-8") as f:
            f.write(stdout.getvalue())
    else:
        os.unlink(log_path)


class CommandInputHandler():
    def name(self):
        clsname = self.__class__.__name__
        name = clsname[0].lower()
        last_upper = False
        for c in clsname[1:]:
            if c.isupper() and not last_upper:
                name += '_'
                name += c.lower()
            else:
                name += c
            last_upper = c.isupper()
        if name.endswith("_input_handler"):
            name = name[0:-14]
        return name

    def next_input(self, args):
        return None

    def placeholder(self):
        return ""

    def initial_text(self):
        return ""

    def preview(self, arg):
        return ""

    def validate(self, arg):
        return True

    def cancel(self):
        pass

    def confirm(self, arg):
        pass

    def create_input_handler_(self, args):
        return self.next_input(args)

    def preview_(self, v):
        ret = self.preview(v)

        if ret is None:
            return ("", 0)
        elif isinstance(ret, sublime.Html):
            return (ret.data, 1)
        else:
            return (ret, 0)

    def validate_(self, v, event):
        if self.want_event():
            return self.validate(v, event)
        return self.validate(v)

    def cancel_(self):
        self.cancel()

    def confirm_(self, v, event):
        if self.want_event():
            self.confirm(v, event)
        else:
            self.confirm(v)

    def want_event(self):
        return False


class BackInputHandler(CommandInputHandler):
    def name(self):
        return "_Back"


class TextInputHandler(CommandInputHandler):
    def description(self, text):
        return text

    def setup_(self, args):
        props = {
            "initial_text": self.initial_text(),
            "placeholder_text": self.placeholder(),
            "type": "text",
        }

        return ([], props)

    def description_(self, v, text):
        res = self.description(text)
        if res is None:
            return ""
        return res


class ListInputHandler(CommandInputHandler):
    def list_items(self):
        return []

    def description(self, v, text):
        return text

    def setup_(self, args):
        items = self.list_items()

        selected_item_index = -1

        if isinstance(items, tuple):
            items, selected_item_index = items

        item_tuples = []
        for item in items:
            if isinstance(item, str):
                item_tuples.append((item, item))
            elif isinstance(item, (list, tuple)):
                item_tuples.append(item)
            elif isinstance(item, sublime.ListInputItem):
                details = "\x1f".join(item.details) if isinstance(item.details, (list, tuple)) else item.details
                if item.annotation != "" or item.kind != (sublime.KIND_ID_AMBIGUOUS, "", ""):
                    kind_letter = 0
                    if isinstance(item.kind[1], str) and len(item.kind[1]) == 1:
                        kind_letter = ord(item.kind[1])
                    item_tuples.append((
                        (
                            item.text,
                            details,
                            item.annotation,
                            (item.kind[0], kind_letter, item.kind[2])
                        ),
                        item.value
                    ))
                elif details is not None and details != "":
                    item_tuples.append(((item.text, details, True), item.value))
                else:
                    item_tuples.append((item.text, item.value))
            else:
                raise TypeError("items must contain only str, list, tuple or ListInputItem objects")

        props = {
            "initial_text": self.initial_text(),
            "placeholder_text": self.placeholder(),
            "selected": selected_item_index,
            "type": "list",
        }

        return (item_tuples, props)

    def description_(self, v, text):
        res = self.description(v, text)
        if res is None:
            return ""
        return res


class Command():
    def name(self):
        clsname = self.__class__.__name__
        name = clsname[0].lower()
        last_upper = False
        for c in clsname[1:]:
            if c.isupper() and not last_upper:
                name += '_'
                name += c.lower()
            else:
                name += c
            last_upper = c.isupper()
        if name.endswith("_command"):
            name = name[0:-8]
        return name

    def is_enabled_(self, args):
        ret = None
        try:
            args = self.filter_args(args)
            if args:
                ret = self.is_enabled(**args)
            else:
                ret = self.is_enabled()
        except TypeError:
            ret = self.is_enabled()

        if not isinstance(ret, bool):
            raise ValueError("is_enabled must return a bool", self)

        return ret

    def is_enabled(self):
        return True

    def is_visible_(self, args):
        ret = None
        try:
            args = self.filter_args(args)
            if args:
                ret = self.is_visible(**args)
            else:
                ret = self.is_visible()
        except TypeError:
            ret = self.is_visible()

        if not isinstance(ret, bool):
            raise ValueError("is_visible must return a bool", self)

        return ret

    def is_visible(self):
        return True

    def is_checked_(self, args):
        ret = None
        try:
            args = self.filter_args(args)
            if args:
                ret = self.is_checked(**args)
            else:
                ret = self.is_checked()
        except TypeError:
            ret = self.is_checked()

        if not isinstance(ret, bool):
            raise ValueError("is_checked must return a bool", self)

        return ret

    def is_checked(self):
        return False

    def description_(self, args):
        try:
            args = self.filter_args(args)
            if args is not None:
                res = self.description(**args)
            else:
                res = self.description()
            if res is None:
                return ""
            return res
        except TypeError:
            return ""

    def description(self):
        return ""

    def filter_args(self, args):
        if args:
            if 'event' in args and not self.want_event():
                args = args.copy()
                del args['event']

        return args

    def want_event(self):
        return False

    def input(self, args):
        return None

    def input_description(self):
        return ""

    def create_input_handler_(self, args):
        return self.input(args)


class ApplicationCommand(Command):
    def run_(self, edit_token, args):
        args = self.filter_args(args)
        try:
            if args:
                return self.run(**args)
            else:
                return self.run()
        except (TypeError) as e:
            if 'required positional argument' in str(e):
                if sublime_api.can_accept_input(self.name(), args):
                    sublime.active_window().run_command(
                        'show_overlay',
                        {
                            'overlay': 'command_palette',
                            'command': self.name(),
                            'args': args
                        }
                    )
                    return
            raise

    def run(self):
        pass


class WindowCommand(Command):
    def __init__(self, window):
        self.window = window

    def run_(self, edit_token, args):
        args = self.filter_args(args)
        try:
            if args:
                return self.run(**args)
            else:
                return self.run()
        except (TypeError) as e:
            if 'required positional argument' in str(e):
                if sublime_api.window_can_accept_input(self.window.id(), self.name(), args):
                    sublime_api.window_run_command(
                        self.window.id(),
                        'show_overlay',
                        {
                            'overlay': 'command_palette',
                            'command': self.name(),
                            'args': args
                        }
                    )
                    return
            raise

    def run(self):
        pass


class TextCommand(Command):
    def __init__(self, view):
        self.view = view

    def run_(self, edit_token, args):
        args = self.filter_args(args)
        try:
            if args:
                edit = self.view.begin_edit(edit_token, self.name(), args)
                try:
                    return self.run(edit, **args)
                finally:
                    self.view.end_edit(edit)
            else:
                edit = self.view.begin_edit(edit_token, self.name())
                try:
                    return self.run(edit)
                finally:
                    self.view.end_edit(edit)
        except (TypeError) as e:
            if 'required positional argument' in str(e):
                if sublime_api.view_can_accept_input(self.view.id(), self.name(), args):
                    sublime_api.window_run_command(
                        sublime_api.view_window(self.view.id()),
                        'show_overlay',
                        {
                            'overlay': 'command_palette',
                            'command': self.name(),
                            'args': args
                        }
                    )
                    return
            raise

    def run(self, edit):
        pass


class EventListener():
    pass


class ViewEventListener():
    @classmethod
    def is_applicable(cls, settings):
        return True

    @classmethod
    def applies_to_primary_view_only(cls):
        return True

    def __init__(self, view):
        self.view = view


class TextChangeListener:
    """ Base implementation of a text change listener.

    An instance may be added to a view using `sublime.View.add_text_listener`.

    Has the following callbacks:

    on_text_changed(changes):
        Called when text is changed in a buffer.

        :param changes:
            A list of TextChange

    on_text_changed_async(changes):
        Async version of on_text_changed_async.

    on_revert():
        Called when the buffer is reverted.

        A revert does not trigger text changes. If the contents of the buffer
        are required here use View.substr()

    on_revert_async():
        Async version of on_revert_async.

    on_reload():
        Called when the buffer is reloaded.

        A reload does not trigger text changes. If the contents of the buffer
        are required here use View.substr()

    on_reload_async():
        Async version of on_reload_async.
    """

    @classmethod
    def is_applicable(cls, buffer):
        return True

    def __init__(self):
        self.__key = None
        self.buffer = None

    def detach(self):
        """ Remove this listener from the buffer.

        Async callbacks may still be called after this, as they are queued
        separately.
        """
        if self.__key is None:
            raise ValueError('TextChangeListener is not attached')

        sublime_api.buffer_clear_text_listener(self.buffer.buffer_id, self.__key)
        if self.buffer.buffer_id in text_change_listeners:
            new_listeners = []
            for listener in text_change_listeners[self.buffer.buffer_id]:
                if listener is not self:
                    new_listeners.append(listener)
            text_change_listeners[self.buffer.buffer_id] = new_listeners
        self.__key = None

    def attach(self, buffer):
        """ Attach this listener to a buffer.

        :param buffer:
            A sublime.Buffer instance.
        """
        if not isinstance(buffer, sublime.Buffer):
            raise TypeError('Must be a buffer')

        if self.__key is not None:
            raise ValueError('TextChangeListener is already attached')

        self.buffer = buffer
        if buffer.buffer_id not in text_change_listeners:
            text_change_listeners[buffer.buffer_id] = []
        text_change_listeners[buffer.buffer_id].append(self)
        self.__key = sublime_api.buffer_add_text_listener(buffer.buffer_id, self)

    def is_attached(self):
        """ Check whether the listener is receiving events from a buffer.

        May not be called from __init__.
        """
        return self.__key is not None


class MultizipImporter():
    def __init__(self):
        self.loaders = []
        self.file_loaders = []

    def find_module(self, fullname, path=None):
        if not path:
            for l in self.loaders:
                if l.name == fullname:
                    return l

        for l in self.loaders:
            if path == [l.zippath]:
                if l.has(fullname):
                    return l

        return None


class ZipLoader():
    def __init__(self, zippath):
        self.zippath = zippath
        self.name = os.path.splitext(os.path.basename(zippath))[0]
        self._scan_zip()

    def has(self, fullname):
        name, key = fullname.split('.', 1)
        if name == self.name and key in self.contents:
            return True

        override_file = os.path.join(override_path, os.sep.join(fullname.split('.')) + '.py')
        if os.path.isfile(override_file):
            return True

        override_package = os.path.join(override_path, os.sep.join(fullname.split('.')))
        if os.path.isdir(override_package):
            return True

        return False

    def load_module(self, fullname):
        # Only if a module is being reloaded and hasn't been scanned recently
        # do we force a refresh of the contents of the .sublime-package. This
        # allows proper code upgrades using Package Control.
        if fullname in imp._RELOADING:
            if self.refreshed < time.time() - 5:
                self._scan_zip()

        source, source_path, is_pkg = self._read_source(fullname)

        if source is None:
            raise ImportError("No module named '%s'" % fullname)

        is_new = False
        if fullname in sys.modules:
            mod = sys.modules[fullname]
            old_mod_file = mod.__file__
        else:
            is_new = True
            mod = sys.modules.setdefault(fullname, imp.new_module(fullname))
            mod.__name__ = fullname
            mod.__path__ = [self.zippath]
            mod.__loader__ = self

        mod.__file__ = source_path

        if is_pkg:
            mod.__package__ = mod.__name__
        else:
            mod.__package__ = fullname.rpartition('.')[0]

        try:
            exec(compile(source, source_path, 'exec'), mod.__dict__)
            return mod

        except:
            if is_new:
                del sys.modules[fullname]
            else:
                mod.__file__ = old_mod_file
            raise

    def get_source(self, fullname):
        name, key = fullname.split('.', 1)
        if name != self.name:
            return None
        source, _, _ = self._read_source(fullname)
        return source

    def _read_source(self, fullname):
        name_parts = fullname.split('.')
        override_basename = os.path.join(override_path, *name_parts)
        override_py = override_basename + '.py'
        override_init = os.path.join(override_basename, '__init__.py')

        if os.path.isfile(override_py):
            try:
                with open(override_py, 'r', encoding='utf-8') as f:
                    return (f.read(), override_py, False)
            except (Exception) as e:
                print(override_py, 'could not be read:', e)

        if os.path.isfile(override_init):
            try:
                with open(override_init, 'r', encoding='utf-8') as f:
                    return (f.read(), override_init, True)
            except (Exception) as e:
                print(override_init, 'could not be read:', e)

        key = '.'.join(name_parts[1:])
        if key in self.contents:
            source = self.contents[key]
            source_path = os.path.join(self.zippath, self.filenames[key]).rstrip(os.sep)
            is_pkg = key in self.packages
            return (source, source_path, is_pkg)

        # This allows .py overrides to exist in subfolders that:
        #  1. Do not exist in the .sublime-package file
        #  2. Do not contain an __init__.py
        if os.path.isdir(override_basename):
            return ('', override_basename, True)

        return (None, None, False)

    def _scan_zip(self):
        self.contents = {"": ""}
        self.filenames = {"": ""}
        self.packages = {""}
        self.refreshed = time.time()

        try:
            with zipfile.ZipFile(self.zippath, 'r') as z:
                files = [i.filename for i in z.infolist()]

                for f in files:
                    base, ext = os.path.splitext(f)
                    if ext != ".py":
                        continue

                    paths = base.split('/')
                    if len(paths) > 0 and paths[len(paths) - 1] == "__init__":
                        paths.pop()
                        self.packages.add('.'.join(paths))

                    try:
                        pkg_path = '.'.join(paths)
                        self.contents[pkg_path] = z.read(f).decode('utf-8')
                        self.filenames[pkg_path] = f
                    except UnicodeDecodeError:
                        print(f, "in", self.zippath, "is not utf-8 encoded, unable to load plugin")
                        continue

                    while len(paths) > 1:
                        paths.pop()
                        parent = '.'.join(paths)
                        if parent not in self.contents:
                            self.contents[parent] = ""
                            self.filenames[parent] = parent
                            self.packages.add(parent)
        except (Exception) as e:
            print("Error loading %s:" % self.zippath, e)


override_path = None
multi_importer = MultizipImporter()
sys.meta_path.insert(0, multi_importer)


def update_compressed_packages(pkgs):
    multi_importer.loaders = []
    for p in pkgs:
        try:
            multi_importer.loaders.append(ZipLoader(p))
        except (FileNotFoundError, zipfile.BadZipFile) as e:
            print("error loading " + p + ": " + str(e))


def set_override_path(path):
    global override_path
    override_path = path
