<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* server/databases/index.twig */
class __TwigTemplate_ecadc40d529703d7321fcfa1f4fb4f68c0f10fc75d122277b0a09be382ca24ae extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<div class=\"container-fluid my-3\">
  <h2>
    ";
        // line 3
        echo PhpMyAdmin\Html\Generator::getIcon("s_db", ((($context["has_statistics"] ?? null)) ? (_gettext("Databases statistics")) : (_gettext("Databases"))));
        echo "
  </h2>

  ";
        // line 6
        if (($context["is_create_database_shown"] ?? null)) {
            // line 7
            echo "    <div class=\"card\">
      <div class=\"card-header\">
        ";
            // line 9
            echo PhpMyAdmin\Html\Generator::getIcon("b_newdb", _gettext("Create database"));
            echo "
        ";
            // line 10
            echo PhpMyAdmin\Html\MySQLDocumentation::show("CREATE_DATABASE");
            echo "
      </div>
      <div class=\"card-body\">
        ";
            // line 13
            if (($context["has_create_database_privileges"] ?? null)) {
                // line 14
                echo "          <form method=\"post\" action=\"";
                echo PhpMyAdmin\Url::getFromRoute("/server/databases/create");
                echo "\" id=\"create_database_form\" class=\"ajax row row-cols-md-auto g-3 align-items-center\">
            ";
                // line 15
                echo PhpMyAdmin\Url::getHiddenInputs("", "");
                echo "
            <input type=\"hidden\" name=\"reload\" value=\"1\">
            ";
                // line 17
                if (($context["has_statistics"] ?? null)) {
                    // line 18
                    echo "              <input type=\"hidden\" name=\"statistics\" value=\"1\">
            ";
                }
                // line 20
                echo "
            <div class=\"col-12\">
              <input type=\"text\" name=\"new_db\" maxlength=\"64\" class=\"form-control\" value=\"";
                // line 23
                echo twig_escape_filter($this->env, ($context["database_to_create"] ?? null), "html", null, true);
                echo "\" id=\"text_create_db\" placeholder=\"";
echo _gettext("Database name");
                // line 24
                echo "\" aria-label=\"";
echo _gettext("Database name");
                echo "\" required>
            </div>

            ";
                // line 27
                if ( !twig_test_empty(($context["charsets"] ?? null))) {
                    // line 28
                    echo "              <div class=\"col-12\">
                <select lang=\"en\" dir=\"ltr\" name=\"db_collation\" class=\"form-select\" aria-label=\"";
echo _gettext("Collation");
                    // line 29
                    echo "\">
                  <option value=\"\">";
echo _gettext("Collation");
                    // line 30
                    echo "</option>
                  <option value=\"\"></option>
                  ";
                    // line 32
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable(($context["charsets"] ?? null));
                    foreach ($context['_seq'] as $context["_key"] => $context["charset"]) {
                        // line 33
                        echo "                    <optgroup label=\"";
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["charset"], "name", [], "any", false, false, false, 33), "html", null, true);
                        echo "\" title=\"";
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["charset"], "description", [], "any", false, false, false, 33), "html", null, true);
                        echo "\">
                      ";
                        // line 34
                        $context['_parent'] = $context;
                        $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, $context["charset"], "collations", [], "any", false, false, false, 34));
                        foreach ($context['_seq'] as $context["_key"] => $context["collation"]) {
                            // line 35
                            echo "                        <option value=\"";
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["collation"], "name", [], "any", false, false, false, 35), "html", null, true);
                            echo "\" title=\"";
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["collation"], "description", [], "any", false, false, false, 35), "html", null, true);
                            echo "\"";
                            echo ((twig_get_attribute($this->env, $this->source, $context["collation"], "is_selected", [], "any", false, false, false, 35)) ? (" selected") : (""));
                            echo ">";
                            // line 36
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["collation"], "name", [], "any", false, false, false, 36), "html", null, true);
                            // line 37
                            echo "</option>
                      ";
                        }
                        $_parent = $context['_parent'];
                        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['collation'], $context['_parent'], $context['loop']);
                        $context = array_intersect_key($context, $_parent) + $_parent;
                        // line 39
                        echo "                    </optgroup>
                  ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['charset'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 41
                    echo "                </select>
              </div>
            ";
                }
                // line 44
                echo "
            <div class=\"col-12\">
              <input id=\"buttonGo\" class=\"btn btn-primary\" type=\"submit\" value=\"";
echo _gettext("Create");
                // line 46
                echo "\">
            </div>
          </form>
        ";
            } else {
                // line 50
                echo "          <span class=\"text-danger\">";
                echo PhpMyAdmin\Html\Generator::getIcon("s_error", _gettext("No privileges to create databases"));
                echo "</span>
        ";
            }
            // line 52
            echo "      </div>
    </div>
  ";
        }
        // line 55
        echo "
  ";
        // line 56
        if ((1 === twig_compare(($context["database_count"] ?? null), 0))) {
            // line 57
            echo "    <div class=\"d-flex flex-wrap my-3\">
      ";
            // line 58
            if (($context["is_drop_allowed"] ?? null)) {
                // line 59
                echo "        <div>
          <div class=\"input-group\">
            <div class=\"input-group-text\">
              <div class=\"form-check mb-0\">
                <input class=\"form-check-input checkall_box\" type=\"checkbox\" value=\"\" id=\"checkAllCheckbox\" form=\"dbStatsForm\">
                <label class=\"form-check-label\" for=\"checkAllCheckbox\">";
echo _gettext("Check all");
                // line 64
                echo "</label>
              </div>
            </div>
            <button class=\"btn btn-outline-secondary\" id=\"bulkActionDropButton\" type=\"submit\" name=\"submit_mult\" value=\"Drop\" form=\"dbStatsForm\" title=\"";
echo _gettext("Drop");
                // line 67
                echo "\">
              ";
                // line 68
                echo PhpMyAdmin\Html\Generator::getIcon("db_drop", _gettext("Drop"));
                echo "
            </button>
          </div>
        </div>
      ";
            }
            // line 73
            echo "
      <div class=\"ms-auto\">
        <div class=\"input-group\">
          <span class=\"input-group-text\">";
            // line 76
            echo PhpMyAdmin\Html\Generator::getImage("b_search", _gettext("Search"));
            echo "</span>
          <input class=\"form-control\" name=\"filterText\" type=\"text\" id=\"filterText\" value=\"\" placeholder=\"";
echo _gettext("Search");
            // line 77
            echo "\" aria-label=\"";
echo _gettext("Search");
            echo "\">
        </div>
      </div>
    </div>

    ";
            // line 82
            echo PhpMyAdmin\Html\Generator::getListNavigator(            // line 83
($context["database_count"] ?? null),             // line 84
($context["pos"] ?? null),             // line 85
($context["url_params"] ?? null), PhpMyAdmin\Url::getFromRoute("/server/databases"), "frame_content",             // line 88
($context["max_db_list"] ?? null));
            // line 89
            echo "

    <form class=\"ajax\" action=\"";
            // line 91
            echo PhpMyAdmin\Url::getFromRoute("/server/databases");
            echo "\" method=\"post\" name=\"dbStatsForm\" id=\"dbStatsForm\">
      ";
            // line 92
            echo PhpMyAdmin\Url::getHiddenInputs(($context["url_params"] ?? null));
            echo "
      <div class=\"table-responsive\">
        <table class=\"table table-striped table-hover w-auto\">
          <thead>
            <tr>
              ";
            // line 97
            if (($context["is_drop_allowed"] ?? null)) {
                // line 98
                echo "                <th></th>
              ";
            }
            // line 100
            echo "              <th>
                <a href=\"";
            // line 101
            echo PhpMyAdmin\Url::getFromRoute("/server/databases", twig_array_merge(($context["url_params"] ?? null), ["sort_by" => "SCHEMA_NAME", "sort_order" => ((((0 === twig_compare(twig_get_attribute($this->env, $this->source,             // line 103
($context["url_params"] ?? null), "sort_by", [], "any", false, false, false, 103), "SCHEMA_NAME")) && (0 === twig_compare(twig_get_attribute($this->env, $this->source,             // line 104
($context["url_params"] ?? null), "sort_order", [], "any", false, false, false, 104), "asc")))) ? ("desc") : ("asc"))]));
            // line 105
            echo "\">
                  ";
echo _gettext("Database");
            // line 107
            echo "                  ";
            if ((0 === twig_compare(twig_get_attribute($this->env, $this->source, ($context["url_params"] ?? null), "sort_by", [], "any", false, false, false, 107), "SCHEMA_NAME"))) {
                // line 108
                echo "                    ";
                if ((0 === twig_compare(twig_get_attribute($this->env, $this->source, ($context["url_params"] ?? null), "sort_order", [], "any", false, false, false, 108), "asc"))) {
                    // line 109
                    echo "                      ";
                    echo PhpMyAdmin\Html\Generator::getImage("s_asc", _gettext("Ascending"));
                    echo "
                    ";
                } else {
                    // line 111
                    echo "                      ";
                    echo PhpMyAdmin\Html\Generator::getImage("s_desc", _gettext("Descending"));
                    echo "
                    ";
                }
                // line 113
                echo "                  ";
            }
            // line 114
            echo "                </a>
              </th>

              <th>
                <a href=\"";
            // line 118
            echo PhpMyAdmin\Url::getFromRoute("/server/databases", twig_array_merge(($context["url_params"] ?? null), ["sort_by" => "DEFAULT_COLLATION_NAME", "sort_order" => ((((0 === twig_compare(twig_get_attribute($this->env, $this->source,             // line 120
($context["url_params"] ?? null), "sort_by", [], "any", false, false, false, 120), "DEFAULT_COLLATION_NAME")) && (0 === twig_compare(twig_get_attribute($this->env, $this->source,             // line 121
($context["url_params"] ?? null), "sort_order", [], "any", false, false, false, 121), "asc")))) ? ("desc") : ("asc"))]));
            // line 122
            echo "\">
                  ";
echo _gettext("Collation");
            // line 124
            echo "                  ";
            if ((0 === twig_compare(twig_get_attribute($this->env, $this->source, ($context["url_params"] ?? null), "sort_by", [], "any", false, false, false, 124), "DEFAULT_COLLATION_NAME"))) {
                // line 125
                echo "                    ";
                if ((0 === twig_compare(twig_get_attribute($this->env, $this->source, ($context["url_params"] ?? null), "sort_order", [], "any", false, false, false, 125), "asc"))) {
                    // line 126
                    echo "                      ";
                    echo PhpMyAdmin\Html\Generator::getImage("s_asc", _gettext("Ascending"));
                    echo "
                    ";
                } else {
                    // line 128
                    echo "                      ";
                    echo PhpMyAdmin\Html\Generator::getImage("s_desc", _gettext("Descending"));
                    echo "
                    ";
                }
                // line 130
                echo "                  ";
            }
            // line 131
            echo "                </a>
              </th>

              ";
            // line 134
            if (($context["has_statistics"] ?? null)) {
                // line 135
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(($context["header_statistics"] ?? null));
                foreach ($context['_seq'] as $context["name"] => $context["statistic"]) {
                    // line 136
                    echo "                  <th";
                    echo (((0 === twig_compare(twig_get_attribute($this->env, $this->source, $context["statistic"], "format", [], "any", false, false, false, 136), "byte"))) ? (" colspan=\"2\"") : (""));
                    echo ">
                    <a href=\"";
                    // line 137
                    echo PhpMyAdmin\Url::getFromRoute("/server/databases", twig_array_merge(($context["url_params"] ?? null), ["sort_by" =>                     // line 138
$context["name"], "sort_order" => ((((0 === twig_compare(twig_get_attribute($this->env, $this->source,                     // line 139
($context["url_params"] ?? null), "sort_by", [], "any", false, false, false, 139), $context["name"])) && (0 === twig_compare(twig_get_attribute($this->env, $this->source,                     // line 140
($context["url_params"] ?? null), "sort_order", [], "any", false, false, false, 140), "asc")))) ? ("desc") : ("asc"))]));
                    // line 141
                    echo "\">
                      ";
                    // line 142
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "title", [], "any", false, false, false, 142), "html", null, true);
                    echo "
                      ";
                    // line 143
                    if ((0 === twig_compare(twig_get_attribute($this->env, $this->source, ($context["url_params"] ?? null), "sort_by", [], "any", false, false, false, 143), $context["name"]))) {
                        // line 144
                        echo "                        ";
                        if ((0 === twig_compare(twig_get_attribute($this->env, $this->source, ($context["url_params"] ?? null), "sort_order", [], "any", false, false, false, 144), "asc"))) {
                            // line 145
                            echo "                          ";
                            echo PhpMyAdmin\Html\Generator::getImage("s_asc", _gettext("Ascending"));
                            echo "
                        ";
                        } else {
                            // line 147
                            echo "                          ";
                            echo PhpMyAdmin\Html\Generator::getImage("s_desc", _gettext("Descending"));
                            echo "
                        ";
                        }
                        // line 149
                        echo "                      ";
                    }
                    // line 150
                    echo "                    </a>
                  </th>
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['name'], $context['statistic'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 153
                echo "              ";
            }
            // line 154
            echo "
              ";
            // line 155
            if (($context["has_primary_replication"] ?? null)) {
                // line 156
                echo "                <th>";
echo _gettext("Primary replication");
                echo "</th>
              ";
            }
            // line 158
            echo "
              ";
            // line 159
            if (($context["has_replica_replication"] ?? null)) {
                // line 160
                echo "                <th>";
echo _gettext("Replica replication");
                echo "</th>
              ";
            }
            // line 162
            echo "
              <th>";
echo _gettext("Action");
            // line 163
            echo "</th>
            </tr>
          </thead>

          <tbody>
            ";
            // line 168
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["databases"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["database"]) {
                // line 169
                echo "              <tr class=\"db-row";
                echo (((twig_get_attribute($this->env, $this->source, $context["database"], "is_system_schema", [], "any", false, false, false, 169) || twig_get_attribute($this->env, $this->source, $context["database"], "is_pmadb", [], "any", false, false, false, 169))) ? (" noclick") : (""));
                echo "\" data-filter-row=\"";
                echo twig_escape_filter($this->env, twig_upper_filter($this->env, twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 169)), "html", null, true);
                echo "\">
                ";
                // line 170
                if (($context["is_drop_allowed"] ?? null)) {
                    // line 171
                    echo "                  <td class=\"tool\">
                    <input type=\"checkbox\" name=\"selected_dbs[]\" class=\"checkall\" title=\"";
                    // line 173
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 173), "html", null, true);
                    echo "\" value=\"";
                    // line 174
                    echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 174), "html", null, true);
                    echo "\"";
                    // line 175
                    echo (((twig_get_attribute($this->env, $this->source, $context["database"], "is_system_schema", [], "any", false, false, false, 175) || twig_get_attribute($this->env, $this->source, $context["database"], "is_pmadb", [], "any", false, false, false, 175))) ? (" disabled") : (""));
                    echo ">
                  </td>
                ";
                }
                // line 178
                echo "
                <td class=\"name\">
                  <a href=\"";
                // line 180
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["database"], "url", [], "any", false, false, false, 180), "html", null, true);
                echo "\" title=\"";
                // line 181
                echo twig_escape_filter($this->env, twig_sprintf(_gettext("Jump to database '%s'"), twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 181)), "html", null, true);
                echo "\">
                    ";
                // line 182
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 182), "html", null, true);
                echo "
                  </a>
                </td>

                <td class=\"value\">
                  <dfn title=\"";
                // line 187
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, $context["database"], "collation", [], "any", false, false, false, 187), "description", [], "any", false, false, false, 187), "html", null, true);
                echo "\">
                    ";
                // line 188
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, $context["database"], "collation", [], "any", false, false, false, 188), "name", [], "any", false, false, false, 188), "html", null, true);
                echo "
                  </dfn>
                </td>

                ";
                // line 192
                if (($context["has_statistics"] ?? null)) {
                    // line 193
                    echo "                  ";
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, $context["database"], "statistics", [], "any", false, false, false, 193));
                    foreach ($context['_seq'] as $context["_key"] => $context["statistic"]) {
                        // line 194
                        echo "                    ";
                        if ((twig_get_attribute($this->env, $this->source, $context["statistic"], "format", [], "any", false, false, false, 194) === "byte")) {
                            // line 195
                            echo "                      ";
                            $context["value"] = PhpMyAdmin\Util::formatByteDown(twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 195), 3, 1);
                            // line 196
                            echo "                      <td class=\"value\">
                        <data value=\"";
                            // line 197
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 197), "html", null, true);
                            echo "\" title=\"";
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 197), "html", null, true);
                            echo "\">
                          ";
                            // line 198
                            echo twig_escape_filter($this->env, (($__internal_compile_0 = ($context["value"] ?? null)) && is_array($__internal_compile_0) || $__internal_compile_0 instanceof ArrayAccess ? ($__internal_compile_0[0] ?? null) : null), "html", null, true);
                            echo "
                        </data>
                      </td>
                      <td class=\"unit\">";
                            // line 201
                            echo twig_escape_filter($this->env, (($__internal_compile_1 = ($context["value"] ?? null)) && is_array($__internal_compile_1) || $__internal_compile_1 instanceof ArrayAccess ? ($__internal_compile_1[1] ?? null) : null), "html", null, true);
                            echo "</td>
                    ";
                        } else {
                            // line 203
                            echo "                      <td class=\"value\">
                        <data value=\"";
                            // line 204
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 204), "html", null, true);
                            echo "\" title=\"";
                            echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 204), "html", null, true);
                            echo "\">
                          ";
                            // line 205
                            echo twig_escape_filter($this->env, PhpMyAdmin\Util::formatNumber(twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 205), 0), "html", null, true);
                            echo "
                        </data>
                      </td>
                    ";
                        }
                        // line 209
                        echo "                  ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['statistic'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 210
                    echo "                ";
                }
                // line 211
                echo "
                ";
                // line 212
                if (twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, $context["database"], "replication", [], "any", false, false, false, 212), "primary", [], "any", false, false, false, 212), "status", [], "any", false, false, false, 212)) {
                    // line 213
                    echo "                  ";
                    if (twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, $context["database"], "replication", [], "any", false, false, false, 213), "primary", [], "any", false, false, false, 213), "is_replicated", [], "any", false, false, false, 213)) {
                        // line 214
                        echo "                    <td class=\"tool text-center\">
                      ";
                        // line 215
                        echo PhpMyAdmin\Html\Generator::getIcon("s_success", _gettext("Replicated"));
                        echo "
                    </td>
                  ";
                    } else {
                        // line 218
                        echo "                    <td class=\"tool text-center\">
                      ";
                        // line 219
                        echo PhpMyAdmin\Html\Generator::getIcon("s_cancel", _gettext("Not replicated"));
                        echo "
                    </td>
                  ";
                    }
                    // line 222
                    echo "                ";
                }
                // line 223
                echo "
                ";
                // line 224
                if (twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, $context["database"], "replication", [], "any", false, false, false, 224), "replica", [], "any", false, false, false, 224), "status", [], "any", false, false, false, 224)) {
                    // line 225
                    echo "                  ";
                    if (twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, twig_get_attribute($this->env, $this->source, $context["database"], "replication", [], "any", false, false, false, 225), "replica", [], "any", false, false, false, 225), "is_replicated", [], "any", false, false, false, 225)) {
                        // line 226
                        echo "                    <td class=\"tool text-center\">
                      ";
                        // line 227
                        echo PhpMyAdmin\Html\Generator::getIcon("s_success", _gettext("Replicated"));
                        echo "
                    </td>
                  ";
                    } else {
                        // line 230
                        echo "                    <td class=\"tool text-center\">
                      ";
                        // line 231
                        echo PhpMyAdmin\Html\Generator::getIcon("s_cancel", _gettext("Not replicated"));
                        echo "
                    </td>
                  ";
                    }
                    // line 234
                    echo "                ";
                }
                // line 235
                echo "
                <td class=\"tool\">
                  <a class=\"server_databases\" data=\"";
                // line 238
                echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 238), "html", null, true);
                echo "\" href=\"";
                echo PhpMyAdmin\Url::getFromRoute("/server/privileges", ["db" => twig_get_attribute($this->env, $this->source,                 // line 239
$context["database"], "name", [], "any", false, false, false, 239), "checkprivsdb" => twig_get_attribute($this->env, $this->source,                 // line 240
$context["database"], "name", [], "any", false, false, false, 240)]);
                // line 241
                echo "\" title=\"";
                // line 242
                echo twig_escape_filter($this->env, twig_sprintf(_gettext("Check privileges for database \"%s\"."), twig_get_attribute($this->env, $this->source, $context["database"], "name", [], "any", false, false, false, 242)), "html", null, true);
                echo "\">
                    ";
                // line 243
                echo PhpMyAdmin\Html\Generator::getIcon("s_rights", _gettext("Check privileges"));
                echo "
                  </a>
                </td>
              </tr>
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['database'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 248
            echo "          </tbody>

          <tfoot>
            <tr>
              <th colspan=\"";
            // line 252
            echo ((($context["is_drop_allowed"] ?? null)) ? ("3") : ("2"));
            echo "\">
                ";
echo _gettext("Total:");
            // line 254
            echo "                <span id=\"filter-rows-count\">";
            // line 255
            echo twig_escape_filter($this->env, ($context["database_count"] ?? null), "html", null, true);
            // line 256
            echo "</span>
              </th>

              ";
            // line 259
            if (($context["has_statistics"] ?? null)) {
                // line 260
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(($context["total_statistics"] ?? null));
                foreach ($context['_seq'] as $context["_key"] => $context["statistic"]) {
                    // line 261
                    echo "                  ";
                    if ((twig_get_attribute($this->env, $this->source, $context["statistic"], "format", [], "any", false, false, false, 261) === "byte")) {
                        // line 262
                        echo "                    ";
                        $context["value"] = PhpMyAdmin\Util::formatByteDown(twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 262), 3, 1);
                        // line 263
                        echo "                    <th class=\"value\">
                      <data value=\"";
                        // line 264
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 264), "html", null, true);
                        echo "\" title=\"";
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 264), "html", null, true);
                        echo "\">
                        ";
                        // line 265
                        echo twig_escape_filter($this->env, (($__internal_compile_2 = ($context["value"] ?? null)) && is_array($__internal_compile_2) || $__internal_compile_2 instanceof ArrayAccess ? ($__internal_compile_2[0] ?? null) : null), "html", null, true);
                        echo "
                      </data>
                    </th>
                    <th class=\"unit\">";
                        // line 268
                        echo twig_escape_filter($this->env, (($__internal_compile_3 = ($context["value"] ?? null)) && is_array($__internal_compile_3) || $__internal_compile_3 instanceof ArrayAccess ? ($__internal_compile_3[1] ?? null) : null), "html", null, true);
                        echo "</th>
                  ";
                    } else {
                        // line 270
                        echo "                    <th class=\"value\">
                      <data value=\"";
                        // line 271
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 271), "html", null, true);
                        echo "\" title=\"";
                        echo twig_escape_filter($this->env, twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 271), "html", null, true);
                        echo "\">
                        ";
                        // line 272
                        echo twig_escape_filter($this->env, PhpMyAdmin\Util::formatNumber(twig_get_attribute($this->env, $this->source, $context["statistic"], "raw", [], "any", false, false, false, 272), 0), "html", null, true);
                        echo "
                      </data>
                    </th>
                  ";
                    }
                    // line 276
                    echo "                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['statistic'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 277
                echo "              ";
            }
            // line 278
            echo "
              ";
            // line 279
            if (($context["has_primary_replication"] ?? null)) {
                // line 280
                echo "                <th></th>
              ";
            }
            // line 282
            echo "
              ";
            // line 283
            if (($context["has_replica_replication"] ?? null)) {
                // line 284
                echo "                <th></th>
              ";
            }
            // line 286
            echo "
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </form>

    ";
            // line 294
            if ( !($context["has_statistics"] ?? null)) {
                // line 295
                echo "      <div class=\"card\">
        <div class=\"card-body\">
          <div class=\"alert alert-info\" role=\"alert\">
            ";
                // line 298
                echo PhpMyAdmin\Html\Generator::getIcon("s_notice", _gettext("Note: Enabling the database statistics here might cause heavy traffic between the web server and the MySQL server."));
                echo "
          </div>
          <a class=\"card-link\" href=\"";
                // line 300
                echo PhpMyAdmin\Url::getFromRoute("/server/databases");
                echo "\" data-post=\"";
                echo PhpMyAdmin\Url::getCommon(["statistics" => "1"], "", false);
                echo "\" title=\"";
echo _gettext("Enable statistics");
                echo "\">
            ";
echo _gettext("Enable statistics");
                // line 302
                echo "          </a>
        </div>
      </div>
    ";
            }
            // line 306
            echo "  ";
        } else {
            // line 307
            echo "    <div class=\"alert alert-primary my-3\" role=\"alert\">
      ";
            // line 308
            echo PhpMyAdmin\Html\Generator::getIcon("s_notice", _gettext("No databases"));
            echo "
    </div>
  ";
        }
        // line 311
        echo "</div>

";
        // line 313
        if (($context["is_drop_allowed"] ?? null)) {
            // line 314
            echo "  <div class=\"modal fade\" id=\"dropDatabaseModal\" tabindex=\"-1\" aria-labelledby=\"dropDatabaseModalLabel\" aria-hidden=\"true\">
    <div class=\"modal-dialog modal-dialog-scrollable\">
      <div class=\"modal-content\">
        <div class=\"modal-header\">
          <h5 class=\"modal-title\" id=\"dropDatabaseModalLabel\">";
echo _gettext("Confirm");
            // line 318
            echo "</h5>
          <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
echo _gettext("Cancel");
            // line 319
            echo "\"></button>
        </div>
        <div class=\"modal-body\"></div>
        <div class=\"modal-footer\">
          <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
echo _gettext("Cancel");
            // line 323
            echo "</button>
          <button type=\"button\" class=\"btn btn-danger\" id=\"dropDatabaseModalDropButton\">";
echo _gettext("Drop");
            // line 324
            echo "</button>
        </div>
      </div>
    </div>
  </div>
";
        }
    }

    public function getTemplateName()
    {
        return "server/databases/index.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  792 => 324,  788 => 323,  781 => 319,  777 => 318,  770 => 314,  768 => 313,  764 => 311,  758 => 308,  755 => 307,  752 => 306,  746 => 302,  737 => 300,  732 => 298,  727 => 295,  725 => 294,  715 => 286,  711 => 284,  709 => 283,  706 => 282,  702 => 280,  700 => 279,  697 => 278,  694 => 277,  688 => 276,  681 => 272,  675 => 271,  672 => 270,  667 => 268,  661 => 265,  655 => 264,  652 => 263,  649 => 262,  646 => 261,  641 => 260,  639 => 259,  634 => 256,  632 => 255,  630 => 254,  625 => 252,  619 => 248,  608 => 243,  604 => 242,  602 => 241,  600 => 240,  599 => 239,  596 => 238,  592 => 235,  589 => 234,  583 => 231,  580 => 230,  574 => 227,  571 => 226,  568 => 225,  566 => 224,  563 => 223,  560 => 222,  554 => 219,  551 => 218,  545 => 215,  542 => 214,  539 => 213,  537 => 212,  534 => 211,  531 => 210,  525 => 209,  518 => 205,  512 => 204,  509 => 203,  504 => 201,  498 => 198,  492 => 197,  489 => 196,  486 => 195,  483 => 194,  478 => 193,  476 => 192,  469 => 188,  465 => 187,  457 => 182,  453 => 181,  450 => 180,  446 => 178,  440 => 175,  437 => 174,  434 => 173,  431 => 171,  429 => 170,  422 => 169,  418 => 168,  411 => 163,  407 => 162,  401 => 160,  399 => 159,  396 => 158,  390 => 156,  388 => 155,  385 => 154,  382 => 153,  374 => 150,  371 => 149,  365 => 147,  359 => 145,  356 => 144,  354 => 143,  350 => 142,  347 => 141,  345 => 140,  344 => 139,  343 => 138,  342 => 137,  337 => 136,  332 => 135,  330 => 134,  325 => 131,  322 => 130,  316 => 128,  310 => 126,  307 => 125,  304 => 124,  300 => 122,  298 => 121,  297 => 120,  296 => 118,  290 => 114,  287 => 113,  281 => 111,  275 => 109,  272 => 108,  269 => 107,  265 => 105,  263 => 104,  262 => 103,  261 => 101,  258 => 100,  254 => 98,  252 => 97,  244 => 92,  240 => 91,  236 => 89,  234 => 88,  233 => 85,  232 => 84,  231 => 83,  230 => 82,  221 => 77,  216 => 76,  211 => 73,  203 => 68,  200 => 67,  194 => 64,  186 => 59,  184 => 58,  181 => 57,  179 => 56,  176 => 55,  171 => 52,  165 => 50,  159 => 46,  154 => 44,  149 => 41,  142 => 39,  135 => 37,  133 => 36,  125 => 35,  121 => 34,  114 => 33,  110 => 32,  106 => 30,  102 => 29,  98 => 28,  96 => 27,  89 => 24,  85 => 23,  81 => 20,  77 => 18,  75 => 17,  70 => 15,  65 => 14,  63 => 13,  57 => 10,  53 => 9,  49 => 7,  47 => 6,  41 => 3,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "server/databases/index.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\server\\databases\\index.twig");
    }
}
