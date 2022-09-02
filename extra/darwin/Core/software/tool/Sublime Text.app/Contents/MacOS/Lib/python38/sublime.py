import collections
import html
import json
import sys
import io

import sublime_api


class _LogWriter(io.TextIOBase):
    def __init__(self):
        self.buf = None

    def flush(self):
        b = self.buf
        self.buf = None
        if b is not None and len(b):
            sublime_api.log_message(b)

    def write(self, s):
        if self.buf is None:
            self.buf = s
        else:
            self.buf += s
        if '\n' in s or '\r' in s:
            self.flush()


sys.stdout = _LogWriter()
sys.stderr = _LogWriter()

HOVER_TEXT = 1
HOVER_GUTTER = 2
HOVER_MARGIN = 3

ENCODED_POSITION = 1
TRANSIENT = 4
FORCE_GROUP = 8
# Only valid with ADD_TO_SELECTION or REPLACE_MRU
SEMI_TRANSIENT = 16
ADD_TO_SELECTION = 32
REPLACE_MRU = 64
# Only valid with ADD_TO_SELECTION
CLEAR_TO_RIGHT = 128

IGNORECASE = 2
LITERAL = 1

MONOSPACE_FONT = 1
KEEP_OPEN_ON_FOCUS_LOST = 2
WANT_EVENT = 4

HTML = 1
COOPERATE_WITH_AUTO_COMPLETE = 2
HIDE_ON_MOUSE_MOVE = 4
HIDE_ON_MOUSE_MOVE_AWAY = 8
KEEP_ON_SELECTION_MODIFIED = 16
HIDE_ON_CHARACTER_EVENT = 32

DRAW_EMPTY = 1
HIDE_ON_MINIMAP = 2
DRAW_EMPTY_AS_OVERWRITE = 4
PERSISTENT = 16
# Deprecated, use DRAW_NO_FILL instead
DRAW_OUTLINED = 32
DRAW_NO_FILL = 32
DRAW_NO_OUTLINE = 256
DRAW_SOLID_UNDERLINE = 512
DRAW_STIPPLED_UNDERLINE = 1024
DRAW_SQUIGGLY_UNDERLINE = 2048
NO_UNDO = 8192
HIDDEN = 128

OP_EQUAL = 0
OP_NOT_EQUAL = 1
OP_REGEX_MATCH = 2
OP_NOT_REGEX_MATCH = 3
OP_REGEX_CONTAINS = 4
OP_NOT_REGEX_CONTAINS = 5
CLASS_WORD_START = 1
CLASS_WORD_END = 2
CLASS_PUNCTUATION_START = 4
CLASS_PUNCTUATION_END = 8
CLASS_SUB_WORD_START = 16
CLASS_SUB_WORD_END = 32
CLASS_LINE_START = 64
CLASS_LINE_END = 128
CLASS_EMPTY_LINE = 256

INHIBIT_WORD_COMPLETIONS = 8
INHIBIT_EXPLICIT_COMPLETIONS = 16
DYNAMIC_COMPLETIONS = 32
INHIBIT_REORDER = 128

DIALOG_CANCEL = 0
DIALOG_YES = 1
DIALOG_NO = 2

UI_ELEMENT_SIDE_BAR = 1
UI_ELEMENT_MINIMAP = 2
UI_ELEMENT_TABS = 4
UI_ELEMENT_STATUS_BAR = 8
UI_ELEMENT_MENU = 16
UI_ELEMENT_OPEN_FILES = 32

LAYOUT_INLINE = 0
LAYOUT_BELOW = 1
LAYOUT_BLOCK = 2

KIND_ID_AMBIGUOUS = 0
KIND_ID_KEYWORD = 1
KIND_ID_TYPE = 2
KIND_ID_FUNCTION = 3
KIND_ID_NAMESPACE = 4
KIND_ID_NAVIGATION = 5
KIND_ID_MARKUP = 6
KIND_ID_VARIABLE = 7
KIND_ID_SNIPPET = 8

# These should only be used for QuickPanelItem
# and ListInputItem, not for CompletionItem
KIND_ID_COLOR_REDISH = 9
KIND_ID_COLOR_ORANGISH = 10
KIND_ID_COLOR_YELLOWISH = 11
KIND_ID_COLOR_GREENISH = 12
KIND_ID_COLOR_CYANISH = 13
KIND_ID_COLOR_BLUISH = 14
KIND_ID_COLOR_PURPLISH = 15
KIND_ID_COLOR_PINKISH = 16
KIND_ID_COLOR_DARK = 17
KIND_ID_COLOR_LIGHT = 18

KIND_AMBIGUOUS = (KIND_ID_AMBIGUOUS, "", "")
KIND_KEYWORD = (KIND_ID_KEYWORD, "", "")
KIND_TYPE = (KIND_ID_TYPE, "", "")
KIND_FUNCTION = (KIND_ID_FUNCTION, "", "")
KIND_NAMESPACE = (KIND_ID_NAMESPACE, "", "")
KIND_NAVIGATION = (KIND_ID_NAVIGATION, "", "")
KIND_MARKUP = (KIND_ID_MARKUP, "", "")
KIND_VARIABLE = (KIND_ID_VARIABLE, "", "")
KIND_SNIPPET = (KIND_ID_SNIPPET, "s", "Snippet")

SYMBOL_SOURCE_ANY = 0
SYMBOL_SOURCE_INDEX = 1
SYMBOL_SOURCE_OPEN_FILES = 2

SYMBOL_TYPE_ANY = 0
SYMBOL_TYPE_DEFINITION = 1
SYMBOL_TYPE_REFERENCE = 2

COMPLETION_FORMAT_TEXT = 0
COMPLETION_FORMAT_SNIPPET = 1
COMPLETION_FORMAT_COMMAND = 2

COMPLETION_FLAG_KEEP_PREFIX = 1


def version():
    return sublime_api.version()


def platform():
    return sublime_api.platform()


def arch():
    return sublime_api.architecture()


def channel():
    return sublime_api.channel()


def executable_path():
    return sublime_api.executable_path()


def executable_hash():
    import hashlib
    return (
        version(), platform() + '_' + arch(),
        hashlib.md5(open(executable_path(), 'rb').read()).hexdigest())


def packages_path():
    return sublime_api.packages_path()


def installed_packages_path():
    return sublime_api.installed_packages_path()


def cache_path():
    """ Returns the path where Sublime Text stores cache files """
    return sublime_api.cache_path()


def status_message(msg):
    sublime_api.status_message(msg)


def error_message(msg):
    sublime_api.error_message(msg)


def message_dialog(msg):
    sublime_api.message_dialog(msg)


def ok_cancel_dialog(msg, ok_title="", title=""):
    """
    Show a popup dialog with an "ok" and "cancel" button.

    msg: str - The message to show in the dialog.
    ok_title: str - Optional replacement string for the "ok" button.
    title: str - Optional title for the dialog. Note Linux and macOS do not have
                 a title in their dialog.
    """
    return sublime_api.ok_cancel_dialog(msg, title, ok_title)


def yes_no_cancel_dialog(msg, yes_title="", no_title="", title=""):
    """
    Show a popup dialog with a "yes", "no" and "cancel" button.

    msg: str - The message to show in the dialog.
    yes_title: str - Optional replacement string for the "yes" button.
    no_title: str - Optional replacement string for the "no" button.
    title: str - Optional title for the dialog. Note Linux and macOS do not have
                 a title in their dialog.
    """
    return sublime_api.yes_no_cancel_dialog(msg, title, yes_title, no_title)


def open_dialog(callback, file_types=[], directory=None, multi_select=False, allow_folders=False):
    """
    Show the open file dialog.

    callback - Called with selected path or `None` once open dialog is closed.
    file_types: [(str, [str])] - A list of allowed file types, consisting of a
                                 description and a list of allowed extensions.
    directory: str | None - The directory the dialog should start in. Will use
                            the virtual working directory if not provided.
    multi_select: bool - Whether to allow selecting multiple files. Function
                         will call callback with a list if this is True.
    allow_folders: bool - Whether to also allow selecting folders. Only works on
                          macOS. If you only want to select folders use
                          `select_folder_dialog`.
    """
    flags = 0
    if multi_select:
        flags |= 1
    if allow_folders:
        flags |= 2

    cb = callback
    if not multi_select:
        cb = lambda files: callback(files[0] if files else None)

    sublime_api.open_dialog(file_types, directory or '', flags, cb)


def save_dialog(callback, file_types=[], directory=None, name=None, extension=None):
    """
    Show the save file dialog.

    callback - Called with selected path or `None` once open dialog is closed.
    file_types: [(str, [str])] - A list of allowed file types, consisting of a
                                 description and a list of allowed extensions.
    directory: str | None - The directory the dialog should start in. Will use
                            the virtual working directory if not provided.
    name: str | None - The default name of the file in the save dialog.
    extension: str | None - The default extension used in the save dialog.
    """
    sublime_api.save_dialog(file_types, directory or '', name or '', extension or '', callback)


def select_folder_dialog(callback, directory=None, multi_select=False):
    """
    Show the select folder dialog.

    callback - Called with selected path or `None` once open dialog is closed.
    directory: str | None - The directory the dialog should start in. Will use
                            the virtual working directory if not provided.
    multi_select: bool - Whether to allow selecting multiple folders. Function
                         will call callback with a list if this is True.
    """
    cb = callback
    if not multi_select:
        cb = lambda folders: callback(folders[0] if folders else None)

    sublime_api.select_folder_dialog(directory or '', multi_select, cb)


def run_command(cmd, args=None):
    sublime_api.run_command(cmd, args)


def format_command(cmd, args=None):
    if args is None:
        return cmd
    else:
        arg_str = json.dumps(
            args,
            ensure_ascii=False,
            check_circular=False,
            separators=(',', ':')
        )
        return f'{cmd} {arg_str}'


def html_format_command(cmd, args=None):
    return html.escape(format_command(cmd, args), quote=True)


def command_url(cmd, args=None):
    return f'subl:{html_format_command(cmd, args)}'


def get_clipboard_async(callback, size_limit=16777216):
    """
    Calls callback with the contents of the clipboard. For performance reasons
    if the size of the clipboard content is bigger than size_limit, an empty
    string will be returned.
    """
    sublime_api.get_clipboard_async(callback, size_limit)


def get_clipboard(size_limit=16777216):
    """
    Returns the content of the clipboard. For performance reasons if the size of
    the clipboard content is bigger than size_limit, an empty string will be
    returned.

    Warning: Deprecated in favor of get_clipboard_async
    """
    return sublime_api.get_clipboard(size_limit)


def set_clipboard(text):
    return sublime_api.set_clipboard(text)


def log_commands(flag=None):
    if flag is None:
        flag = not get_log_commands()
    sublime_api.log_commands(flag)


def get_log_commands():
    return sublime_api.get_log_commands()


def log_input(flag=None):
    """
    Enables or disables input logging. This is useful to find the names of
    certain keys on the keyboard
    """
    if flag is None:
        flag = not get_log_input()
    sublime_api.log_input(flag)


def get_log_input():
    return sublime_api.get_log_input()


def log_fps(flag=None):
    """
    Enables or disables fps logging.
    """
    if flag is None:
        flag = not get_log_fps()
    sublime_api.log_fps(flag)


def get_log_fps():
    return sublime_api.get_log_fps()


def log_result_regex(flag=None):
    """
    Enables or disables result regex logging. This is useful when trying to
    debug file_regex and line_regex in build systems
    """
    if flag is None:
        flag = not get_log_result_regex()
    sublime_api.log_result_regex(flag)


def get_log_result_regex():
    return sublime_api.get_log_result_regex()


def log_indexing(flag=None):
    if flag is None:
        flag = not get_log_indexing()
    sublime_api.log_indexing(flag)


def get_log_indexing():
    return sublime_api.get_log_indexing()


def log_build_systems(flag=None):
    if flag is None:
        flag = not get_log_build_systems()
    sublime_api.log_build_systems(flag)


def get_log_build_systems():
    return sublime_api.get_log_build_systems()


def log_control_tree(flag=None):
    if flag is None:
        flag = not get_log_control_tree()
    sublime_api.log_control_tree(flag)


def get_log_control_tree():
    return sublime_api.get_log_control_tree()


def ui_info():
    return sublime_api.ui_info()


def score_selector(scope_name, selector):
    return sublime_api.score_selector(scope_name, selector)


def load_resource(name):
    s = sublime_api.load_resource(name)
    if s is None:
        raise FileNotFoundError(f'resource "{name}" not found')
    return s


def load_binary_resource(name):
    bytes = sublime_api.load_binary_resource(name)
    if bytes is None:
        raise FileNotFoundError(f'resource "{name}" not found')
    return bytes


def find_resources(pattern):
    return sublime_api.find_resources(pattern)


def encode_value(val, pretty=False):
    return sublime_api.encode_value(val, pretty)


def decode_value(data):
    val, err = sublime_api.decode_value(data)

    if err:
        raise ValueError(err)

    return val


def expand_variables(val, variables):
    return sublime_api.expand_variables(val, variables)


def load_settings(base_name):
    settings_id = sublime_api.load_settings(base_name)
    return Settings(settings_id)


def save_settings(base_name):
    sublime_api.save_settings(base_name)


def set_timeout(f, timeout_ms=0):
    """
    Schedules a function to be called in the future. Sublime Text will block
    while the function is running
    """
    sublime_api.set_timeout(f, timeout_ms)


def set_timeout_async(f, timeout_ms=0):
    """
    Schedules a function to be called in the future. The function will be
    called in a worker thread, and Sublime Text will not block while the
    function is running
    """
    sublime_api.set_timeout_async(f, timeout_ms)


def active_window():
    return Window(sublime_api.active_window())


def windows():
    return [Window(id) for id in sublime_api.windows()]


def get_macro():
    return sublime_api.get_macro()


class Window:
    def __init__(self, id):
        self.window_id = id
        self.settings_object = None
        self.template_settings_object = None

    def __hash__(self):
        return self.window_id

    def __eq__(self, other):
        return isinstance(other, Window) and other.window_id == self.window_id

    def __bool__(self):
        return self.window_id != 0

    def __repr__(self):
        return f'Window({self.window_id!r})'

    def id(self):
        return self.window_id

    def is_valid(self):
        return sublime_api.window_num_groups(self.window_id) != 0

    def hwnd(self):
        """ Platform specific window handle, only returns a meaningful result under Windows """
        return sublime_api.window_system_handle(self.window_id)

    def active_sheet(self):
        sheet_id = sublime_api.window_active_sheet(self.window_id)
        if sheet_id == 0:
            return None
        else:
            return make_sheet(sheet_id)

    def active_view(self):
        view_id = sublime_api.window_active_view(self.window_id)
        if view_id == 0:
            return None
        else:
            return View(view_id)

    def new_html_sheet(self, name, contents, flags=0, group=-1):
        return make_sheet(sublime_api.window_new_html_sheet(
            self.window_id, name, contents, flags, group))

    def run_command(self, cmd, args=None):
        sublime_api.window_run_command(self.window_id, cmd, args)

    def new_file(self, flags=0, syntax=""):
        """ flags must be either 0 or TRANSIENT """
        return View(sublime_api.window_new_file(self.window_id, flags, syntax))

    def open_file(self, fname, flags=0, group=-1):
        """
        valid bits for flags are:
        ENCODED_POSITION: fname name may have :row:col or :row suffix
        TRASIENT: don't add the file to the list of open buffers
        FORCE_GROUP: don't select the file if it's opened in a different group
        SEMI_TRANSIENT: open the file in semi-transient mode
        ADD_TO_SELECTION: add the file to the selected sheets
        REPLACE_MRU: replace the active sheet in the group
        CLEAR_TO_RIGHT: unselect all files to the right of the active sheet
        """
        return View(sublime_api.window_open_file(self.window_id, fname, flags, group))

    def find_open_file(self, fname):
        view_id = sublime_api.window_find_open_file(self.window_id, fname)
        if view_id == 0:
            return None
        else:
            return View(view_id)

    def file_history(self):
        return sublime_api.window_file_history(self.window_id)

    def num_groups(self):
        return sublime_api.window_num_groups(self.window_id)

    def active_group(self):
        return sublime_api.window_active_group(self.window_id)

    def focus_group(self, idx):
        sublime_api.window_focus_group(self.window_id, idx)

    def focus_sheet(self, sheet):
        if sheet:
            sublime_api.window_focus_sheet(self.window_id, sheet.sheet_id)

    def focus_view(self, view):
        if view:
            sublime_api.window_focus_view(self.window_id, view.view_id)

    def select_sheets(self, sheets):
        sublime_api.window_select_sheets(self.window_id, [s.sheet_id for s in sheets])

    def bring_to_front(self):
        sublime_api.window_bring_to_front(self.window_id)

    def get_sheet_index(self, sheet):
        if sheet:
            return sublime_api.window_get_sheet_index(self.window_id, sheet.sheet_id)
        else:
            return (-1, -1)

    def get_view_index(self, view):
        if view:
            return sublime_api.window_get_view_index(self.window_id, view.view_id)
        else:
            return (-1, -1)

    def set_sheet_index(self, sheet, group, idx):
        sublime_api.window_set_sheet_index(self.window_id, sheet.sheet_id, group, idx)

    def set_view_index(self, view, group, idx):
        sublime_api.window_set_view_index(self.window_id, view.view_id, group, idx)

    def move_sheets_to_group(self, sheets, group, insertion_idx=-1, select=True):
        """
        Moves all unique provided sheets to specified group at insertion index provided.
        If an index is not provided defaults to last index of the destination group.

        :param sheets:
                A List of Sheet objects

        :param group:
                An int specifying the destination group

        :param insertion_idx:
                An int specifying the insertion index

        :param select:
                A bool specifying whether the moved sheets should be selected
        """
        sheet_ids = []
        for sheet in sheets:
            if not isinstance(sheet, Sheet):
                raise TypeError('list must contain items of type sublime.Sheet only')
            sheet_ids.append(sheet.id())
        sublime_api.window_move_sheets_to_group(self.window_id, sheet_ids, group, insertion_idx, select)

    def sheets(self):
        sheet_ids = sublime_api.window_sheets(self.window_id)
        return [make_sheet(x) for x in sheet_ids]

    def views(self, *, include_transient=False):
        view_ids = sublime_api.window_views(self.window_id, include_transient)
        return [View(x) for x in view_ids]

    def selected_sheets(self):
        sheet_ids = sublime_api.window_selected_sheets(self.window_id)
        return [make_sheet(s) for s in sheet_ids]

    def selected_sheets_in_group(self, group):
        sheet_ids = sublime_api.window_selected_sheets_in_group(self.window_id, group)
        return [make_sheet(s) for s in sheet_ids]

    def active_sheet_in_group(self, group):
        sheet_id = sublime_api.window_active_sheet_in_group(self.window_id, group)
        if sheet_id == 0:
            return None
        else:
            return make_sheet(sheet_id)

    def active_view_in_group(self, group):
        view_id = sublime_api.window_active_view_in_group(self.window_id, group)
        if view_id == 0:
            return None
        else:
            return View(view_id)

    def sheets_in_group(self, group):
        sheet_ids = sublime_api.window_sheets_in_group(self.window_id, group)
        return [make_sheet(x) for x in sheet_ids]

    def views_in_group(self, group):
        view_ids = sublime_api.window_views_in_group(self.window_id, group)
        return [View(x) for x in view_ids]

    def transient_sheet_in_group(self, group):
        sheet_id = sublime_api.window_transient_sheet_in_group(self.window_id, group)
        if sheet_id != 0:
            return make_sheet(sheet_id)
        else:
            return None

    def transient_view_in_group(self, group):
        view_id = sublime_api.window_transient_view_in_group(self.window_id, group)
        if view_id != 0:
            return View(view_id)
        else:
            return None

    def layout(self):
        return sublime_api.window_get_layout(self.window_id)

    def get_layout(self):
        """ get_layout() is deprecated, use layout() """
        return sublime_api.window_get_layout(self.window_id)

    def set_layout(self, layout):
        sublime_api.window_set_layout(self.window_id, layout)

    def create_output_panel(self, name, unlisted=False):
        return View(sublime_api.window_create_output_panel(self.window_id, name, unlisted))

    def find_output_panel(self, name):
        view_id = sublime_api.window_find_output_panel(self.window_id, name)
        return View(view_id) if view_id else None

    def destroy_output_panel(self, name):
        sublime_api.window_destroy_output_panel(self.window_id, name)

    def active_panel(self):
        name = sublime_api.window_active_panel(self.window_id)
        return name or None

    def panels(self):
        return sublime_api.window_panels(self.window_id)

    def get_output_panel(self, name):
        """ deprecated, use create_output_panel """
        return self.create_output_panel(name)

    def show_input_panel(self, caption, initial_text, on_done, on_change, on_cancel):
        """ on_done and on_change should accept a string argument, on_cancel should have no arguments """
        return View(sublime_api.window_show_input_panel(
            self.window_id, caption, initial_text, on_done, on_change, on_cancel))

    def show_quick_panel(self, items, on_select, flags=0, selected_index=-1, on_highlight=None, placeholder=None):
        """
        on_select is called when the the quick panel is finished, and should
        accept a single integer, specifying which item was selected, or -1 for
        none. If flags includes WANT_EVENT, on_select should accept a second
        parameter, which will be a dict with the key "modifier_keys" giving
        access to keyboard modifiers pressed when the item was selected.

        on_highlight is called when the quick panel is still active, and
        indicates the current highlighted index

        flags is a bitwise OR of MONOSPACE_FONT, KEEP_OPEN_ON_FOCUS_LOST and
        WANT_EVENT
        """

        item_tuples = []
        if len(items) > 0:
            for item in items:
                if isinstance(item, str):
                    item_tuples.append(item)
                elif isinstance(item, (list, tuple)):
                    item_tuples.append((item[0], "\x1f".join(item[1:])))
                elif isinstance(item, QuickPanelItem):
                    details = "\x1f".join(item.details) if isinstance(item.details, (list, tuple)) else item.details
                    if item.annotation != "" or item.kind != (KIND_ID_AMBIGUOUS, "", ""):
                        kind_letter = 0
                        if isinstance(item.kind[1], str) and len(item.kind[1]) == 1:
                            kind_letter = ord(item.kind[1])
                        item_tuples.append((
                            item.trigger,
                            details,
                            item.annotation,
                            (item.kind[0], kind_letter, item.kind[2])
                        ))
                    elif details is not None and details != "":
                        item_tuples.append((item.trigger, details, True))
                    else:
                        item_tuples.append(item.trigger)
                else:
                    raise TypeError("items must contain only str, list, tuple or QuickPanelItem objects")

        sublime_api.window_show_quick_panel(
            self.window_id, item_tuples, on_select, on_highlight,
            flags, selected_index, placeholder or '')

    def is_sidebar_visible(self):
        return sublime_api.window_is_ui_element_visible(self.window_id, UI_ELEMENT_SIDE_BAR)

    def set_sidebar_visible(self, flag):
        sublime_api.window_set_ui_element_visible(self.window_id, UI_ELEMENT_SIDE_BAR, flag)

    def is_minimap_visible(self):
        return sublime_api.window_is_ui_element_visible(self.window_id, UI_ELEMENT_MINIMAP)

    def set_minimap_visible(self, flag):
        sublime_api.window_set_ui_element_visible(self.window_id, UI_ELEMENT_MINIMAP, flag)

    def is_status_bar_visible(self):
        return sublime_api.window_is_ui_element_visible(self.window_id, UI_ELEMENT_STATUS_BAR)

    def set_status_bar_visible(self, flag):
        sublime_api.window_set_ui_element_visible(self.window_id, UI_ELEMENT_STATUS_BAR, flag)

    def get_tabs_visible(self):
        return sublime_api.window_is_ui_element_visible(self.window_id, UI_ELEMENT_TABS)

    def set_tabs_visible(self, flag):
        sublime_api.window_set_ui_element_visible(self.window_id, UI_ELEMENT_TABS, flag)

    def is_menu_visible(self):
        return sublime_api.window_is_ui_element_visible(self.window_id, UI_ELEMENT_MENU)

    def set_menu_visible(self, flag):
        sublime_api.window_set_ui_element_visible(self.window_id, UI_ELEMENT_MENU, flag)

    def folders(self):
        return sublime_api.window_folders(self.window_id)

    def project_file_name(self):
        name = sublime_api.window_project_file_name(self.window_id)
        if len(name) == 0:
            return None
        else:
            return name

    def project_data(self):
        return sublime_api.window_get_project_data(self.window_id)

    def set_project_data(self, v):
        sublime_api.window_set_project_data(self.window_id, v)

    def workspace_file_name(self):
        name = sublime_api.window_workspace_file_name(self.window_id)
        if len(name) == 0:
            return None
        return name

    def settings(self):
        """ Per-window settings, the contents are persisted in the session """
        if not self.settings_object:
            self.settings_object = Settings(
                sublime_api.window_settings(self.window_id))

        return self.settings_object

    def template_settings(self):
        """ Per-window settings that are persisted in the session, and duplicated into new windows """
        if not self.template_settings_object:
            self.template_settings_object = Settings(
                sublime_api.window_template_settings(self.window_id))

        return self.template_settings_object

    def symbol_locations(self, sym, source=SYMBOL_SOURCE_ANY, type=SYMBOL_TYPE_ANY,
                         kind_id=KIND_ID_AMBIGUOUS, kind_letter=''):
        """
        :param sym:
            A unicode string of a symbol name

        :param source:
            The source to query for symbols. One of the values:
             - sublime.SYMBOL_SOURCE_ANY
             - sublime.SYMBOL_SOURCE_INDEX
             - sublime.SYMBOL_SOURCE_OPEN_FILES

        :param type:
            The type of symbol to return. One of the values:
             - sublime.SYMBOL_TYPE_ANY
             - sublime.SYMBOL_TYPE_DEFINITION
             - sublime.SYMBOL_TYPE_REFERENCE

        :param kind_id:
            The kind to filter the list by. One of the values:
             - sublime.KIND_ID_AMBIGUOUS
             - sublime.KIND_ID_KEYWORD
             - sublime.KIND_ID_TYPE
             - sublime.KIND_ID_FUNCTION
             - sublime.KIND_ID_NAMESPACE
             - sublime.KIND_ID_NAVIGATION
             - sublime.KIND_ID_MARKUP
             - sublime.KIND_ID_VARIABLE
             - sublime.KIND_ID_SNIPPET

        :param kind_letter:
            A unicode character of the kind letter to filter the list by.

        :return:
            A list of sublime.SymbolLocation() objects
        """

        letter = 0
        if not isinstance(kind_letter, str):
            kind_letter = ''
        if len(kind_letter) > 0:
            letter = ord(kind_letter)

        return sublime_api.window_symbol_locations(self.window_id, sym, source, type, kind_id, letter)

    def lookup_symbol_in_index(self, sym):
        """ Finds all files and locations where sym is defined, using the symbol index """
        return sublime_api.window_lookup_symbol(self.window_id, sym)

    def lookup_symbol_in_open_files(self, sym):
        """ Finds all files and locations where sym is defined, searching through open files """
        return sublime_api.window_lookup_symbol_in_open_files(self.window_id, sym)

    def lookup_references_in_index(self, sym):
        """ Finds all files and locations where sym is referenced, using the symbol index """
        return sublime_api.window_lookup_references(self.window_id, sym)

    def lookup_references_in_open_files(self, sym):
        """ Finds all files and locations where sym is referenced, searching through open files """
        return sublime_api.window_lookup_references_in_open_files(self.window_id, sym)

    def extract_variables(self):
        return sublime_api.window_extract_variables(self.window_id)

    def status_message(self, msg):
        sublime_api.window_status_message(self.window_id, msg)


class Edit:
    def __init__(self, token):
        self.edit_token = token

    def __repr__(self):
        return f'Edit({self.edit_token!r})'


class Region:
    __slots__ = ['a', 'b', 'xpos']

    def __init__(self, a, b=None, xpos=-1):
        if b is None:
            b = a
        self.a = a
        self.b = b
        self.xpos = xpos

    def __iter__(self):
        return iter((self.a, self.b))

    def __str__(self):
        return "(" + str(self.a) + ", " + str(self.b) + ")"

    def __repr__(self):
        if self.xpos == -1:
            return f'Region({self.a}, {self.b})'
        return f'Region({self.a}, {self.b}, xpos={self.xpos})'

    def __len__(self):
        return self.size()

    def __eq__(self, rhs):
        return isinstance(rhs, Region) and self.a == rhs.a and self.b == rhs.b

    def __lt__(self, rhs):
        lhs_begin = self.begin()
        rhs_begin = rhs.begin()

        if lhs_begin == rhs_begin:
            return self.end() < rhs.end()
        else:
            return lhs_begin < rhs_begin

    def __contains__(self, v):
        if isinstance(v, Region):
            return v.a in self and v.b in self
        elif isinstance(v, int):
            return v >= self.begin() and v <= self.end()
        else:
            fq_name = ""
            if v.__class__.__module__ not in {'builtins', '__builtin__'}:
                fq_name = f"{v.__class__.__module__}."
            fq_name += v.__class__.__qualname__
            raise TypeError(
                "in <Region> requires int or Region as left operand"
                f", not {fq_name}")

    def to_tuple(self):
        """ Returns a tuple of this region (excluding xpos).

        Use this to uniquely identify a region in a set or similar. Regions
        can't be used for that directly as they may be mutated.
        """
        return (self.a, self.b)

    def empty(self):
        return self.a == self.b

    def begin(self):
        if self.a < self.b:
            return self.a
        else:
            return self.b

    def end(self):
        if self.a < self.b:
            return self.b
        else:
            return self.a

    def size(self):
        return abs(self.a - self.b)

    def contains(self, x):
        return x in self

    def cover(self, rhs):
        a = min(self.begin(), rhs.begin())
        b = max(self.end(), rhs.end())

        if self.a < self.b:
            return Region(a, b)
        else:
            return Region(b, a)

    def intersection(self, rhs):
        if self.end() <= rhs.begin():
            return Region(0)
        if self.begin() >= rhs.end():
            return Region(0)

        return Region(max(self.begin(), rhs.begin()), min(self.end(), rhs.end()))

    def intersects(self, rhs):
        lb = self.begin()
        le = self.end()
        rb = rhs.begin()
        re = rhs.end()

        return (
            (lb == rb and le == re) or
            (rb > lb and rb < le) or (re > lb and re < le) or
            (lb > rb and lb < re) or (le > rb and le < re))


class HistoricPosition:
    __slots__ = ['pt', 'row', 'col', 'col_utf16', 'col_utf8']

    def __init__(self, pt, row, col, col_utf16, col_utf8):
        self.pt = pt
        self.row = row
        self.col = col
        self.col_utf16 = col_utf16
        self.col_utf8 = col_utf8

    def __repr__(self):
        return (f'HistoricPosition(pt={self.pt!r}, row={self.row!r}, '
                f'col={self.col!r}, col_utf16={self.col_utf16!r}, '
                f'col_utf8={self.col_utf8!r})')


class TextChange:
    __slots__ = ['a', 'b', 'len_utf16', 'len_utf8', 'str']

    def __init__(self, pa, pb, len_utf16, len_utf8, str):
        self.a = pa
        self.b = pb
        self.len_utf16 = len_utf16
        self.len_utf8 = len_utf8
        self.str = str

    def __repr__(self):
        return (f'TextChange({self.a!r}, {self.b!r}, '
                f'len_utf16={self.len_utf16!r}, len_utf8={self.len_utf8!r}, '
                f'str={self.str!r})')


class Selection:
    def __init__(self, id):
        self.view_id = id

    def __iter__(self):
        i = 0
        n = len(self)
        while i < n:
            yield sublime_api.view_selection_get(self.view_id, i)
            i += 1

    def __len__(self):
        return sublime_api.view_selection_size(self.view_id)

    def __getitem__(self, index):
        r = sublime_api.view_selection_get(self.view_id, index)
        if r.a == -1:
            raise IndexError()
        return r

    def __delitem__(self, index):
        sublime_api.view_selection_erase(self.view_id, index)

    def __eq__(self, rhs):
        return rhs is not None and list(self) == list(rhs)

    def __lt__(self, rhs):
        return rhs is not None and list(self) < list(rhs)

    def __bool__(self):
        return self.view_id != 0 and len(self) > 0

    def __str__(self):
        return f"{self!r}[{', '.join(map(str, self))}]"

    def __repr__(self):
        return f'Selection({self.view_id!r})'

    def is_valid(self):
        return sublime_api.view_buffer_id(self.view_id) != 0

    def clear(self):
        sublime_api.view_selection_clear(self.view_id)

    def add(self, x):
        if isinstance(x, Region):
            sublime_api.view_selection_add_region(self.view_id, x.a, x.b, x.xpos)
        else:
            sublime_api.view_selection_add_point(self.view_id, x)

    def add_all(self, regions):
        for r in regions:
            self.add(r)

    def subtract(self, region):
        sublime_api.view_selection_subtract_region(self.view_id, region.a, region.b)

    def contains(self, region):
        return sublime_api.view_selection_contains(self.view_id, region.a, region.b)


def make_sheet(sheet_id):
    if (sheet_id & 3) == 0:
        return TextSheet(sheet_id)
    elif (sheet_id & 3) == 1:
        return ImageSheet(sheet_id)
    elif (sheet_id & 3) == 2:
        return HtmlSheet(sheet_id)
    else:
        return None


class Sheet:
    def __init__(self, id):
        self.sheet_id = id

    def __hash__(self):
        return self.sheet_id

    def __eq__(self, other):
        return isinstance(other, Sheet) and other.sheet_id == self.sheet_id

    def __repr__(self):
        return f'Sheet({self.sheet_id!r})'

    def id(self):
        return self.sheet_id

    def window(self):
        window_id = sublime_api.sheet_window(self.sheet_id)
        if window_id == 0:
            return None
        else:
            return Window(window_id)

    def view(self):
        view_id = sublime_api.sheet_view(self.sheet_id)
        if view_id == 0:
            return None
        else:
            return View(view_id)

    def file_name(self):
        fn = sublime_api.sheet_file_name(self.sheet_id)
        if len(fn) == 0:
            return None
        return fn

    def is_semi_transient(self):
        return sublime_api.sheet_is_semi_transient(self.sheet_id)

    def is_transient(self):
        return sublime_api.sheet_is_transient(self.sheet_id)

    def group(self):
        group_num = sublime_api.sheet_group(self.sheet_id)
        if group_num == -1:
            return None
        return group_num

    def close(self, on_close=lambda did_close: None):
        sublime_api.sheet_close(self.sheet_id, on_close)


class TextSheet(Sheet):
    def __repr__(self):
        return f'TextSheet({self.sheet_id!r})'

    def set_name(self, name):
        sublime_api.sheet_set_name(self.sheet_id, name)


class ImageSheet(Sheet):
    def __repr__(self):
        return f'ImageSheet({self.sheet_id!r})'


class HtmlSheet(Sheet):
    def __repr__(self):
        return f'HtmlSheet({self.sheet_id!r})'

    def set_name(self, name):
        sublime_api.sheet_set_name(self.sheet_id, name)

    def set_contents(self, contents):
        sublime_api.html_sheet_set_contents(self.sheet_id, contents)


class View:
    def __init__(self, id):
        self.view_id = id
        self.selection = Selection(id)
        self.settings_object = None

    def __len__(self):
        return self.size()

    def __hash__(self):
        return self.view_id

    def __eq__(self, other):
        return isinstance(other, View) and other.view_id == self.view_id

    def __bool__(self):
        return self.view_id != 0

    def __repr__(self):
        return f'View({self.view_id!r})'

    def id(self):
        return self.view_id

    def buffer_id(self):
        return sublime_api.view_buffer_id(self.view_id)

    def buffer(self):
        return Buffer(self.buffer_id())

    def sheet_id(self):
        return sublime_api.view_sheet_id(self.view_id)

    def sheet(self):
        return make_sheet(self.sheet_id())

    def element(self):
        e = sublime_api.view_element(self.view_id)
        if e == "":
            return None
        return e

    def is_valid(self):
        """ Returns true if the View is still a valid handle. Will return False for a closed view, for example. """
        return sublime_api.view_buffer_id(self.view_id) != 0

    def is_primary(self):
        return sublime_api.view_is_primary(self.view_id)

    def window(self):
        window_id = sublime_api.view_window(self.view_id)
        if window_id == 0:
            return None
        else:
            return Window(window_id)

    def clones(self):
        """ Get a list of all the other views with the same buffer. """
        return list(map(View, sublime_api.view_clones(self.view_id)))

    def file_name(self):
        name = sublime_api.view_file_name(self.view_id)
        if len(name) == 0:
            return None
        else:
            return name

    def close(self, on_close=lambda did_close: None):
        window_id = sublime_api.view_window(self.view_id)
        return sublime_api.window_close_file(window_id, self.view_id, on_close)

    def retarget(self, new_fname):
        sublime_api.view_retarget(self.view_id, new_fname)

    def name(self):
        return sublime_api.view_get_name(self.view_id)

    def set_name(self, name):
        sublime_api.view_set_name(self.view_id, name)

    def reset_reference_document(self):
        sublime_api.view_reset_reference_document(self.view_id)

    def set_reference_document(self, reference):
        sublime_api.view_set_reference_document(self.view_id, reference)

    def is_loading(self):
        return sublime_api.view_is_loading(self.view_id)

    def is_dirty(self):
        return sublime_api.view_is_dirty(self.view_id)

    def is_read_only(self):
        return sublime_api.view_is_read_only(self.view_id)

    def set_read_only(self, read_only):
        return sublime_api.view_set_read_only(self.view_id, read_only)

    def is_scratch(self):
        return sublime_api.view_is_scratch(self.view_id)

    def set_scratch(self, scratch):
        """
        Sets the scratch flag on the text buffer. When a modified scratch buffer
        is closed, it will be closed without prompting to save.
        """
        return sublime_api.view_set_scratch(self.view_id, scratch)

    def encoding(self):
        return sublime_api.view_encoding(self.view_id)

    def set_encoding(self, encoding_name):
        return sublime_api.view_set_encoding(self.view_id, encoding_name)

    def line_endings(self):
        return sublime_api.view_line_endings(self.view_id)

    def set_line_endings(self, line_ending_name):
        return sublime_api.view_set_line_endings(self.view_id, line_ending_name)

    def size(self):
        return sublime_api.view_size(self.view_id)

    def begin_edit(self, edit_token, cmd, args=None):
        sublime_api.view_begin_edit(self.view_id, edit_token, cmd, args)
        return Edit(edit_token)

    def end_edit(self, edit):
        sublime_api.view_end_edit(self.view_id, edit.edit_token)
        edit.edit_token = 0

    def is_in_edit(self):
        return sublime_api.view_is_in_edit(self.view_id)

    def insert(self, edit, pt, text):
        if edit.edit_token == 0:
            raise ValueError("Edit objects may not be used after the TextCommand's run method has returned")

        return sublime_api.view_insert(self.view_id, edit.edit_token, pt, text)

    def erase(self, edit, r):
        if edit.edit_token == 0:
            raise ValueError("Edit objects may not be used after the TextCommand's run method has returned")

        sublime_api.view_erase(self.view_id, edit.edit_token, r)

    def replace(self, edit, r, text):
        if edit.edit_token == 0:
            raise ValueError("Edit objects may not be used after the TextCommand's run method has returned")

        sublime_api.view_replace(self.view_id, edit.edit_token, r, text)

    def change_count(self):
        """ The change_count is incremented whenever the underlying buffer is modified """
        return sublime_api.view_change_count(self.view_id)

    def change_id(self):
        """ Returns a token that represents the current state of the buffer """
        return sublime_api.view_change_id(self.view_id)

    def transform_region_from(self, r, when):
        """ Given a Region, and a change_id() that describes what version of
        the buffer the region is in relation to, transforms the region into
        the current state of the buffer """
        return sublime_api.view_transform_region_from(self.view_id, r, when)

    def run_command(self, cmd, args=None):
        sublime_api.view_run_command(self.view_id, cmd, args)

    def sel(self):
        return self.selection

    def substr(self, x):
        if isinstance(x, Region):
            return sublime_api.view_cached_substr(self.view_id, x.a, x.b)
        else:
            s = sublime_api.view_cached_substr(self.view_id, x, x + 1)
            # S2 backwards compat
            if len(s) == 0:
                return "\x00"
            else:
                return s

    def find(self, pattern, start_pt, flags=0):
        return sublime_api.view_find(self.view_id, pattern, start_pt, flags)

    def find_all(self, pattern, flags=0, fmt=None, extractions=None):
        if fmt is None:
            return sublime_api.view_find_all(self.view_id, pattern, flags)
        else:
            results = sublime_api.view_find_all_with_contents(self.view_id, pattern, flags, fmt)
            ret = []
            for region, contents in results:
                ret.append(region)
                extractions.append(contents)
            return ret

    def settings(self):
        if not self.settings_object:
            self.settings_object = Settings(sublime_api.view_settings(self.view_id))

        return self.settings_object

    def meta_info(self, key, pt):
        return sublime_api.view_meta_info(self.view_id, key, pt)

    def extract_tokens_with_scopes(self, r):
        return sublime_api.view_extract_tokens_with_scopes(self.view_id, r.begin(), r.end())

    def extract_scope(self, pt):
        return sublime_api.view_extract_scope(self.view_id, pt)

    def scope_name(self, pt):
        return sublime_api.view_scope_name(self.view_id, pt)

    def context_backtrace(self, pt):
        """ Returns a list of the contexts on the stack at the specified point.

        Very slow but useful for debugging a syntax definition.
        """
        return sublime_api.view_context_backtrace(self.view_id, pt)

    def match_selector(self, pt, selector):
        return sublime_api.view_match_selector(self.view_id, pt, selector)

    def score_selector(self, pt, selector):
        return sublime_api.view_score_selector(self.view_id, pt, selector)

    def find_by_selector(self, selector):
        return sublime_api.view_find_by_selector(self.view_id, selector)

    def style(self):
        return sublime_api.view_style(self.view_id)

    def style_for_scope(self, scope):
        return sublime_api.view_style_for_scope(self.view_id, scope)

    def indented_region(self, pt):
        return sublime_api.view_indented_region(self.view_id, pt)

    def indentation_level(self, pt):
        return sublime_api.view_indentation_level(self.view_id, pt)

    def has_non_empty_selection_region(self):
        return sublime_api.view_has_non_empty_selection_region(self.view_id)

    def lines(self, r):
        return sublime_api.view_lines(self.view_id, r)

    def split_by_newlines(self, r):
        return sublime_api.view_split_by_newlines(self.view_id, r)

    def line(self, x):
        if isinstance(x, Region):
            return sublime_api.view_line_from_region(self.view_id, x)
        else:
            return sublime_api.view_line_from_point(self.view_id, x)

    def full_line(self, x):
        if isinstance(x, Region):
            return sublime_api.view_full_line_from_region(self.view_id, x)
        else:
            return sublime_api.view_full_line_from_point(self.view_id, x)

    def word(self, x):
        if isinstance(x, Region):
            return sublime_api.view_word_from_region(self.view_id, x)
        else:
            return sublime_api.view_word_from_point(self.view_id, x)

    def classify(self, pt):
        """ Classifies pt, returning a bitwise OR of zero or more of these flags:
        CLASS_WORD_START
        CLASS_WORD_END
        CLASS_PUNCTUATION_START
        CLASS_PUNCTUATION_END
        CLASS_SUB_WORD_START
        CLASS_SUB_WORD_END
        CLASS_LINE_START
        CLASS_LINE_END
        CLASS_EMPTY_LINE
        """

        return sublime_api.view_classify(self.view_id, pt)

    def find_by_class(self, pt, forward, classes, separators=""):
        return sublime_api.view_find_by_class(self.view_id, pt, forward, classes, separators)

    def expand_by_class(self, x, classes, separators=""):
        if isinstance(x, Region):
            return sublime_api.view_expand_by_class(self.view_id, x.a, x.b, classes, separators)
        else:
            return sublime_api.view_expand_by_class(self.view_id, x, x, classes, separators)

    def rowcol(self, tp):
        return sublime_api.view_row_col(self.view_id, tp)

    def rowcol_utf8(self, tp):
        return sublime_api.view_row_col_utf8(self.view_id, tp)

    def rowcol_utf16(self, tp):
        return sublime_api.view_row_col_utf16(self.view_id, tp)

    def text_point(self, row, col, *, clamp_column=False):
        """ Converts a row and column into a text point """
        return sublime_api.view_text_point(self.view_id, row, col, clamp_column)

    def text_point_utf8(self, row, col_utf8, *, clamp_column=False):
        return sublime_api.view_text_point_utf8(self.view_id, row, col_utf8, clamp_column)

    def text_point_utf16(self, row, col_utf16, *, clamp_column=False):
        return sublime_api.view_text_point_utf16(self.view_id, row, col_utf16, clamp_column)

    def visible_region(self):
        """ Returns the approximate visible region """
        return sublime_api.view_visible_region(self.view_id)

    def show(self, x, show_surrounds=True, keep_to_left=False, animate=True):
        """ Scrolls the view to reveal x, which may be a Region or point """
        if isinstance(x, Region):
            return sublime_api.view_show_region(self.view_id, x, show_surrounds, keep_to_left, animate)
        if isinstance(x, Selection):
            for i in x:
                return sublime_api.view_show_region(self.view_id, i, show_surrounds, keep_to_left, animate)
        else:
            return sublime_api.view_show_point(self.view_id, x, show_surrounds, keep_to_left, animate)

    def show_at_center(self, x, animate=True):
        """ Scrolls the view to center on x, which may be a Region or point """
        if isinstance(x, Region):
            return sublime_api.view_show_region_at_center(self.view_id, x, animate)
        else:
            return sublime_api.view_show_point_at_center(self.view_id, x, animate)

    def viewport_position(self):
        """ Returns the (x, y) scroll position of the view in layout coordinates """
        return sublime_api.view_viewport_position(self.view_id)

    def set_viewport_position(self, xy, animate=True):
        """ Scrolls the view to the given position in layout coordinates """
        return sublime_api.view_set_viewport_position(self.view_id, xy, animate)

    def viewport_extent(self):
        """ Returns the width and height of the viewport, in layout coordinates """
        return sublime_api.view_viewport_extents(self.view_id)

    def layout_extent(self):
        """ Returns the total height and width of the document, in layout coordinates """
        return sublime_api.view_layout_extents(self.view_id)

    def text_to_layout(self, tp):
        """ Converts a text point to layout coordinates """
        return sublime_api.view_text_to_layout(self.view_id, tp)

    def text_to_window(self, tp):
        """ Converts a text point to window coordinates """
        return self.layout_to_window(self.text_to_layout(tp))

    def layout_to_text(self, xy):
        """ Converts layout coordinates to a text point """
        return sublime_api.view_layout_to_text(self.view_id, xy)

    def layout_to_window(self, xy):
        """ Converts layout coordinates to window coordinates """
        return sublime_api.view_layout_to_window(self.view_id, xy)

    def window_to_layout(self, xy):
        """ Converts window coordinates to layout coordinates """
        return sublime_api.view_window_to_layout(self.view_id, xy)

    def window_to_text(self, xy):
        """ Converts window coordinates to a text point """
        return self.layout_to_text(self.window_to_layout(xy))

    def line_height(self):
        """ Returns the height of a line in layout coordinates """
        return sublime_api.view_line_height(self.view_id)

    def em_width(self):
        """ Returns the em-width of the current font in layout coordinates """
        return sublime_api.view_em_width(self.view_id)

    def is_folded(self, sr):
        return sublime_api.view_is_folded(self.view_id, sr)

    def folded_regions(self):
        return sublime_api.view_folded_regions(self.view_id)

    def fold(self, x):
        if isinstance(x, Region):
            return sublime_api.view_fold_region(self.view_id, x)
        else:
            return sublime_api.view_fold_regions(self.view_id, x)

    def unfold(self, x):
        if isinstance(x, Region):
            return sublime_api.view_unfold_region(self.view_id, x)
        else:
            return sublime_api.view_unfold_regions(self.view_id, x)

    def add_regions(self, key, regions, scope="", icon="", flags=0,
                    annotations=[], annotation_color="", on_navigate=None, on_close=None):
        # S2 has an add_regions overload that accepted flags as the 5th
        # positional argument, however this usage is no longer supported
        if not isinstance(icon, "".__class__):
            raise ValueError("icon must be a string")

        if not isinstance(annotations, list):
            raise ValueError("annotations must be a list")

        if len(annotations) != 0 and len(annotations) != len(regions):
            raise ValueError("region and annotation length mismatch")

        sublime_api.view_add_regions(
            self.view_id, key, regions, scope, icon, flags, annotations, annotation_color, on_navigate, on_close)

    def get_regions(self, key):
        return sublime_api.view_get_regions(self.view_id, key)

    def erase_regions(self, key):
        sublime_api.view_erase_regions(self.view_id, key)

    def add_phantom(self, key, region, content, layout, on_navigate=None):
        return sublime_api.view_add_phantom(self.view_id, key, region, content, layout, on_navigate)

    def erase_phantoms(self, key):
        sublime_api.view_erase_phantoms(self.view_id, key)

    def erase_phantom_by_id(self, pid):
        sublime_api.view_erase_phantom(self.view_id, pid)

    def query_phantom(self, pid):
        return sublime_api.view_query_phantoms(self.view_id, [pid])

    def query_phantoms(self, pids):
        return sublime_api.view_query_phantoms(self.view_id, pids)

    def assign_syntax(self, syntax):
        """ Assign the syntax of the view.

        Takes either the path to a syntax or an instance of Syntax.
        """
        if isinstance(syntax, Syntax):
            syntax = syntax.path

        sublime_api.view_assign_syntax(self.view_id, syntax)

    def set_syntax_file(self, syntax_file):
        """ Deprecated, use assign_syntax instead """
        self.assign_syntax(syntax_file)

    def syntax(self):
        """ Get the syntax used by the view. May be None. """
        path = self.settings().get('syntax')
        if not path:
            return None
        return syntax_from_path(path)

    def symbols(self):
        return sublime_api.view_symbols(self.view_id)

    def get_symbols(self):
        """ Deprecated, use symbols """
        return self.symbols()

    def indexed_symbols(self):
        return sublime_api.view_indexed_symbols(self.view_id)

    def indexed_references(self):
        return sublime_api.view_indexed_references(self.view_id)

    def symbol_regions(self):
        """
        :return:
            A list of sublime.SymbolRegion() objects for the symbols in this
            view
        """

        return sublime_api.view_symbol_regions(self.view_id)

    def indexed_symbol_regions(self, type=SYMBOL_TYPE_ANY):
        """
        :param type:
            The type of symbol to return. One of the values:
             - sublime.SYMBOL_TYPE_ANY
             - sublime.SYMBOL_TYPE_DEFINITION
             - sublime.SYMBOL_TYPE_REFERENCE

        :return:
            A list of sublime.SymbolRegion() objects for the indexed symbols
            in this view
        """

        return sublime_api.view_indexed_symbol_regions(self.view_id, type)

    def set_status(self, key, value):
        sublime_api.view_set_status(self.view_id, key, value)

    def get_status(self, key):
        return sublime_api.view_get_status(self.view_id, key)

    def erase_status(self, key):
        sublime_api.view_erase_status(self.view_id, key)

    def extract_completions(self, prefix, tp=-1):
        return sublime_api.view_extract_completions(self.view_id, prefix, tp)

    def find_all_results(self):
        return sublime_api.view_find_all_results(self.view_id)

    def find_all_results_with_text(self):
        return sublime_api.view_find_all_results_with_text(self.view_id)

    def command_history(self, delta, modifying_only=False):
        return sublime_api.view_command_history(self.view_id, delta, modifying_only)

    def overwrite_status(self):
        return sublime_api.view_get_overwrite_status(self.view_id)

    def set_overwrite_status(self, value):
        sublime_api.view_set_overwrite_status(self.view_id, value)

    def show_popup_menu(self, items, on_select, flags=0):
        """
        on_select is called when the the quick panel is finished, and should accept a
        single integer, specifying which item was selected, or -1 for none
        """
        return sublime_api.view_show_popup_table(self.view_id, items, on_select, flags, -1)

    def show_popup(self, content, flags=0, location=-1,
                   max_width=320, max_height=240,
                   on_navigate=None, on_hide=None):
        sublime_api.view_show_popup(
            self.view_id, location, content, flags, max_width, max_height,
            on_navigate, on_hide)

    def update_popup(self, content):
        sublime_api.view_update_popup_content(self.view_id, content)

    def is_popup_visible(self):
        return sublime_api.view_is_popup_visible(self.view_id)

    def hide_popup(self):
        sublime_api.view_hide_popup(self.view_id)

    def is_auto_complete_visible(self):
        return sublime_api.view_is_auto_complete_visible(self.view_id)

    def preserve_auto_complete_on_focus_lost(self):
        sublime_api.view_preserve_auto_complete_on_focus_lost(self.view_id)

    def export_to_html(self, regions=None, minihtml=False,
                       enclosing_tags=False, font_size=True, font_family=True):
        """ Export the view as HTML

        :param regions:
            The region(s) to export. By default it will export the whole view.
            Can be given either a list of regions or a single region.
        :param minihtml:
            Whether the exported HTML should be compatible with the Sublime Text
            HTML implementation.
        :param enclosing_tags:
            Whether to enclose the exported HTML in a tag with top-level
            styling.
        :param font_size:
            Whether to include the font size in the top level styling. Only
            applies when enclosing_tags=True is provided.
        :param font_family:
            Whether to include the font family in the top level styling. Only
            applies when enclosing_tags=True is provided.

        :return:
            A string containing the exported HTML.
        """
        if regions is None:
            regions = [Region(0, self.size())]
        elif isinstance(regions, Region):
            regions = [regions]

        options = 0
        if enclosing_tags:
            options |= 1
        if minihtml:
            options |= 2
        if not font_size:
            options |= 4
        if not font_family:
            options |= 8

        return sublime_api.view_export_to_html(self.view_id, regions, options)

    def clear_undo_stack(self):
        sublime_api.view_clear_undo_stack(self.view_id)


def _buffers():
    return list(map(Buffer, sublime_api.buffers()))


class Buffer:
    def __init__(self, id):
        self.buffer_id = id

    def __hash__(self):
        return self.buffer_id

    def __eq__(self, other):
        return isinstance(other, Buffer) and self.buffer_id == other.buffer_id

    def __repr__(self):
        return f'Buffer({self.buffer_id!r})'

    def id(self):
        return self.buffer_id

    def file_name(self):
        name = sublime_api.buffer_file_name(self.buffer_id)
        if len(name) == 0:
            return None
        else:
            return name

    def views(self):
        return list(map(View, sublime_api.buffer_views(self.buffer_id)))

    def primary_view(self):
        return View(sublime_api.buffer_primary_view(self.buffer_id))


class Settings:
    def __init__(self, id):
        self.settings_id = id

    def __getitem__(self, key):
        res = sublime_api.settings_get(self.settings_id, key)
        if res is None and not sublime_api.settings_has(self.settings_id, key):
            raise KeyError(repr(key))
        return res

    def __setitem__(self, key, value):
        sublime_api.settings_set(self.settings_id, key, value)

    def __delitem__(self, key):
        sublime_api.settings_erase(self.settings_id, key)

    def __contains__(self, key):
        return sublime_api.settings_has(self.settings_id, key)

    def __repr__(self):
        return f'Settings({self.settings_id!r})'

    def to_dict(self):
        """
        Return the settings as a dict. This is not very fast.
        """
        return sublime_api.settings_to_dict(self.settings_id)

    def setdefault(self, key, value):
        if sublime_api.settings_has(self.settings_id, key):
            return sublime_api.settings_get(self.settings_id, key)
        sublime_api.settings_set(self.settings_id, key, value)
        return value

    def update(self, other=(), /, **kwargs):
        if isinstance(other, collections.abc.Mapping):
            for key in other:
                self[key] = other[key]
        elif hasattr(other, 'keys'):
            for key in other.keys():
                self[key] = other[key]
        else:
            for key, value in other:
                self[key] = value

        for key, value in kwargs.items():
            self[key] = value

    def get(self, key, default=None):
        if default is not None:
            return sublime_api.settings_get_default(self.settings_id, key, default)
        else:
            return sublime_api.settings_get(self.settings_id, key)

    def has(self, key):
        return sublime_api.settings_has(self.settings_id, key)

    def set(self, key, value):
        sublime_api.settings_set(self.settings_id, key, value)

    def erase(self, key):
        sublime_api.settings_erase(self.settings_id, key)

    def add_on_change(self, tag, callback):
        sublime_api.settings_add_on_change(self.settings_id, tag, callback)

    def clear_on_change(self, tag):
        sublime_api.settings_clear_on_change(self.settings_id, tag)


class Phantom:
    def __init__(self, region, content, layout, on_navigate=None):
        self.region = region
        self.content = content
        self.layout = layout
        self.on_navigate = on_navigate
        self.id = None

    def __eq__(self, rhs):
        # Note that self.id is not considered
        return (self.region == rhs.region and self.content == rhs.content and
                self.layout == rhs.layout and self.on_navigate == rhs.on_navigate)

    def __repr__(self):
        return (f'Phantom({self.region!r}, {self.content!r}, '
                f'{self.layout!r}, on_navigate={self.on_navigate!r})')

    def to_tuple(self):
        """ Returns a tuple of this phantom.

        Use this to uniquely identify a phantom in a set or similar. Phantoms
        can't be used for that directly as they may be mutated.

        The phantom's range will also be returned as a tuple.
        """
        return (self.region.to_tuple(), self.content, self.layout, self.on_navigate)


class PhantomSet:
    def __init__(self, view, key=""):
        self.view = view
        self.key = key
        self.phantoms = []

    def __del__(self):
        for p in self.phantoms:
            self.view.erase_phantom_by_id(p.id)

    def __repr__(self):
        return f'PhantomSet({self.view!r}, key={self.key!r})'

    def update(self, new_phantoms):
        new_phantoms = {p.to_tuple(): p for p in new_phantoms}

        # Update the list of phantoms that exist in the text buffer with their
        # current location
        regions = self.view.query_phantoms([p.id for p in self.phantoms])
        for phantom, region in zip(self.phantoms, regions):
            phantom.region = region

        current_phantoms = {p.to_tuple(): p for p in self.phantoms}

        for key, p in new_phantoms.items():
            try:
                # Phantom already exists, copy the id from the current one
                p.id = current_phantoms[key].id
            except KeyError:
                p.id = self.view.add_phantom(
                    self.key, p.region, p.content, p.layout, p.on_navigate)

        new_phantom_ids = set([p.id for p in new_phantoms.values()])

        for p in self.phantoms:
            # if the region is -1, then it's already been deleted, no need to
            # call erase
            if p.id not in new_phantom_ids and p.region != Region(-1):
                self.view.erase_phantom_by_id(p.id)

        self.phantoms = [p for p in new_phantoms.values()]


class Html:
    __slots__ = ['data']

    def __init__(self, data):
        self.data = data

    def __repr__(self):
        return f'Html({self.data})'


class CompletionList:
    def __init__(self, completions=None, flags=0):
        self.target = None
        self.completions = completions
        self.flags = flags

    def __repr__(self):
        return f'CompletionList(completions={self.completions!r}, flags={self.flags!r})'

    def _set_target(self, target):
        if self.completions is not None:
            target.completions_ready(self.completions, self.flags)
        else:
            self.target = target

    def set_completions(self, completions, flags=0):
        assert(self.completions is None)
        assert(flags is not None)

        self.completions = completions
        self.flags = flags

        if self.target is not None:
            self.target.completions_ready(completions, flags)


class CompletionItem:
    __slots__ = [
        'trigger',
        'annotation',
        'completion',
        'completion_format',
        'kind',
        'details',
        'flags'
    ]

    def __init__(
            self,
            trigger,
            annotation="",
            completion="",
            completion_format=COMPLETION_FORMAT_TEXT,
            kind=KIND_AMBIGUOUS,
            details=""):

        self.trigger = trigger
        self.annotation = annotation
        self.completion = completion
        self.completion_format = completion_format
        self.kind = kind
        self.details = details
        self.flags = 0

    def __eq__(self, rhs):
        if self.trigger != rhs.trigger:
            return False
        if self.annotation != rhs.annotation:
            return False
        if self.completion != rhs.completion:
            return False
        if self.completion_format != rhs.completion_format:
            return False
        if tuple(self.kind) != tuple(rhs.kind):
            return False
        if self.details != rhs.details:
            return False
        if self.flags != rhs.flags:
            return False
        return True

    def __repr__(self):
        return (f'CompletionItem({self.trigger!r}, '
                f'annotation={self.annotation!r}, '
                f'completion={self.completion!r}, '
                f'completion_format={self.completion_format!r}, '
                f'kind={self.kind!r}, details={self.details!r})')

    @classmethod
    def snippet_completion(
            cls,
            trigger,
            snippet,
            annotation="",
            kind=KIND_SNIPPET,
            details=""):

        return CompletionItem(
            trigger,
            annotation,
            snippet,
            COMPLETION_FORMAT_SNIPPET,
            kind,
            details)

    @classmethod
    def command_completion(
            cls,
            trigger,
            command,
            args={},
            annotation="",
            kind=KIND_AMBIGUOUS,
            details=""):

        return CompletionItem(
            trigger,
            annotation,
            format_command(command, args),
            COMPLETION_FORMAT_COMMAND,
            kind,
            details)


def list_syntaxes():
    """ List all known syntaxes.

    Returns a list of Syntax.
    """
    return sublime_api.list_syntaxes()


def syntax_from_path(path):
    """ Get the syntax for a specific path.

    Returns a Syntax or None.
    """
    return sublime_api.get_syntax(path)


def find_syntax_by_name(name):
    """ Find syntaxes with the specified name.

    Name must match exactly. Return a list of Syntax.
    """
    return [syntax for syntax in list_syntaxes() if syntax.name == name]


def find_syntax_by_scope(scope):
    """ Find syntaxes with the specified scope.

    Scope must match exactly. Return a list of Syntax.
    """
    return [syntax for syntax in list_syntaxes() if syntax.scope == scope]


def find_syntax_for_file(path, first_line=''):
    """ Find the syntax to use for a path.

    Uses the file extension, various application settings and optionally the
    first line of the file to pick the right syntax for the file.

    Returns a Syntax.
    """
    if not isinstance(first_line, str):
        raise TypeError('a str is required for first_line')

    if len(first_line) > 1024:
        first_line = first_line[:1024]

    return sublime_api.find_syntax_for_file(path, first_line)


class Syntax:
    __slots__ = ['path', 'name', 'hidden', 'scope']

    def __init__(self, path, name, hidden, scope):
        self.path = path
        self.name = name
        self.hidden = hidden
        self.scope = scope

    def __eq__(self, other):
        return isinstance(other, Syntax) and self.path == other.path

    def __hash__(self):
        return hash(self.path)

    def __repr__(self):
        return (f'Syntax({self.path!r}, {self.name!r}, {self.hidden!r}, '
                f'{self.scope!r})')


class QuickPanelItem:
    __slots__ = ['trigger', 'details', 'annotation', 'kind']

    def __init__(self, trigger, details="", annotation="", kind=KIND_AMBIGUOUS):
        self.trigger = trigger
        self.details = details
        self.annotation = annotation
        self.kind = kind

    def __repr__(self):
        return (f'QuickPanelItem({self.trigger!r}, '
                f'details={self.details!r}, '
                f'annotation={self.annotation!r}, '
                f'kind={self.kind!r})')


class ListInputItem:
    __slots__ = ['text', 'value', 'details', 'annotation', 'kind']

    def __init__(self, text, value, details="", annotation="", kind=KIND_AMBIGUOUS):
        self.text = text
        self.value = value
        self.details = details
        self.annotation = annotation
        self.kind = kind

    def __repr__(self):
        return (f'ListInputItem({self.text!r}, '
                f'value={self.value!r}, '
                f'details={self.details!r}, '
                f'annotation={self.annotation!r}, '
                f'kind={self.kind!r})')


class SymbolRegion:
    __slots__ = ['name', 'region', 'syntax', 'type', 'kind']

    def __init__(self, name, region, syntax, type, kind):
        self.name = name
        self.region = region
        self.syntax = syntax
        self.type = type
        self.kind = kind

    def __repr__(self):
        return (f'SymbolRegion({self.name!r}, {self.region!r}, '
                f'syntax={self.syntax!r}, type={self.type!r}, '
                f'kind={self.kind!r})')


class SymbolLocation:
    __slots__ = ['path', 'display_name', 'row', 'col', 'syntax', 'type', 'kind']

    def __init__(self, path, display_name, row, col, syntax, type, kind):
        self.path = path
        self.display_name = display_name
        self.row = row
        self.col = col
        self.syntax = syntax
        self.type = type
        self.kind = kind

    def __repr__(self):
        return (f'SymbolLocation({self.path!r}, {self.display_name!r}, '
                f'row={self.row!r}, col={self.col!r}, syntax={self.syntax!r}, '
                f'type={self.type!r}, kind={self.kind!r})')

    def path_encoded_position(self):
        """
        :return:
            A unicode string of the file path, with the row and col appended
            using :row:col, which works with window.open_file() using the
            sublime.ENCODED_POSITION flag.
        """

        return "%s:%d:%d" % (self.path, self.row, self.col)
