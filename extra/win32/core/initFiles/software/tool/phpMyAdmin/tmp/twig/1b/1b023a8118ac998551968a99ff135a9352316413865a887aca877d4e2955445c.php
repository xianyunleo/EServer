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

/* relation/check_relations.twig */
class __TwigTemplate_82a4d87ab7aa1020cfd04bb097d7864fcc3015f239a6de769c1968a4fbdbb557 extends Template
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
        echo "<div class=\"container\">
  <h1 class=\"my-3\">
    ";
echo _gettext("phpMyAdmin configuration storage");
        // line 4
        echo "    ";
        echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "phpmyadmin-configuration-storage");
        echo "
  </h1>

  ";
        // line 7
        if ((null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "db", [], "any", false, false, false, 7))) {
            // line 8
            echo "    <p>
      ";
echo _gettext("Configuration of pmadb…");
            // line 10
            echo "      <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
            echo "</strong></span>
      ";
            // line 11
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "phpmyadmin-configuration-storage");
            echo "
    </p>
    <p>
      ";
echo _gettext("General relation features");
            // line 15
            echo "      <span class=\"text-danger\">";
echo _gettext("Disabled");
            echo "</span>
    </p>
    ";
            // line 17
            if (($context["zero_conf"] ?? null)) {
                // line 18
                echo "      ";
                if ((0 === twig_compare(($context["db"] ?? null), ""))) {
                    // line 19
                    echo "        ";
                    ob_start(function () { return ''; });
                    // line 20
                    echo "          ";
echo _gettext("%sCreate%s a database named '%s' and setup the phpMyAdmin configuration storage there.");
                    // line 21
                    echo "        ";
                    $___internal_parse_0_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
                    // line 19
                    echo $this->env->getFilter('notice')->getCallable()(twig_sprintf($___internal_parse_0_, (((("<a href=\"" . PhpMyAdmin\Url::getFromRoute("/check-relations")) . "\" data-post=\"") . PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "create_pmadb" => true, "goto" => PhpMyAdmin\Url::getFromRoute("/database/operations")])) . "\">"), "</a>", ($context["config_storage_database_name"] ?? null)));
                    // line 22
                    echo "      ";
                } else {
                    // line 23
                    echo "        ";
                    ob_start(function () { return ''; });
                    // line 24
                    echo "          ";
echo _gettext("%sCreate%s the phpMyAdmin configuration storage in the current database.");
                    // line 25
                    echo "        ";
                    $___internal_parse_1_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
                    // line 23
                    echo $this->env->getFilter('notice')->getCallable()(twig_sprintf($___internal_parse_1_, (((("<a href=\"" . PhpMyAdmin\Url::getFromRoute("/check-relations")) . "\" data-post=\"") . PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "fixall_pmadb" => true, "goto" => PhpMyAdmin\Url::getFromRoute("/database/operations")])) . "\">"), "</a>"));
                    // line 26
                    echo "      ";
                }
                // line 27
                echo "    ";
            }
            // line 28
            echo "  ";
        } else {
            // line 29
            echo "    ";
            if ((( !twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "allworks", [], "any", false, false, false, 29) && ($context["zero_conf"] ?? null)) && ($context["are_config_storage_tables_defined"] ?? null))) {
                // line 30
                echo "      ";
                ob_start(function () { return ''; });
                // line 31
                echo "        ";
echo _gettext("%sCreate%s missing phpMyAdmin configuration storage tables.");
                // line 32
                echo "      ";
                $___internal_parse_2_ = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
                // line 30
                echo $this->env->getFilter('notice')->getCallable()(twig_sprintf($___internal_parse_2_, (((("<a href=\"" . PhpMyAdmin\Url::getFromRoute("/check-relations")) . "\" data-post=\"") . PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "fix_pmadb" => true, "goto" => PhpMyAdmin\Url::getFromRoute("/database/operations")])) . "\">"), "</a>"));
                // line 33
                echo "    ";
            }
            // line 34
            echo "
    <table class=\"table table-striped\">
      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['pmadb']</code>
          ";
            // line 39
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_pmadb");
            echo "
        </th>
        <td class=\"text-end\">
          <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
            // line 42
            echo "</strong></span>
        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['relation']</code>
          ";
            // line 50
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_relation");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 53
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "relation", [], "any", false, false, false, 53))) {
                // line 54
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 56
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 58
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("General relation features:");
            // line 63
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "relwork", [], "any", false, false, false, 63)) {
                // line 64
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 66
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 68
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['table_info']</code>
          ";
            // line 75
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_table_info");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 78
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "table_info", [], "any", false, false, false, 78))) {
                // line 79
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 81
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 83
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Display features:");
            // line 88
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "displaywork", [], "any", false, false, false, 88)) {
                // line 89
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 91
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 93
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['table_coords']</code>
          ";
            // line 100
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_table_coords");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 103
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "table_coords", [], "any", false, false, false, 103))) {
                // line 104
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 106
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 108
            echo "        </td>
      </tr>
      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['pdf_pages']</code>
          ";
            // line 113
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_pdf_pages");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 116
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "pdf_pages", [], "any", false, false, false, 116))) {
                // line 117
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 119
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 121
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Designer and creation of PDFs:");
            // line 126
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "pdfwork", [], "any", false, false, false, 126)) {
                // line 127
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 129
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 131
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['column_info']</code>
          ";
            // line 138
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_column_info");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 141
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "column_info", [], "any", false, false, false, 141))) {
                // line 142
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 144
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 146
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Displaying column comments:");
            // line 151
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "commwork", [], "any", false, false, false, 151)) {
                // line 152
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 154
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 156
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Browser transformation:");
            // line 161
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "mimework", [], "any", false, false, false, 161)) {
                // line 162
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 164
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 166
            echo "        </td>
      </tr>
      ";
            // line 168
            if ((twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "commwork", [], "any", false, false, false, 168) &&  !twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "mimework", [], "any", false, false, false, 168))) {
                // line 169
                echo "        <tr>
          <td colspan=\"2\" class=\"text-end\">
            <span class=\"text-danger\">
              ";
echo _gettext("Please see the documentation on how to update your column_info table.");
                // line 173
                echo "              ";
                echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_column_info");
                echo "
            </span>
          </td>
        </tr>
      ";
            }
            // line 178
            echo "      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['bookmarktable']</code>
          ";
            // line 183
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_bookmarktable");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 186
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "bookmark", [], "any", false, false, false, 186))) {
                // line 187
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 189
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 191
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Bookmarked SQL query:");
            // line 196
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "bookmarkwork", [], "any", false, false, false, 196)) {
                // line 197
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 199
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 201
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['history']</code>
          ";
            // line 208
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_history");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 211
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "history", [], "any", false, false, false, 211))) {
                // line 212
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 214
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 216
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("SQL history:");
            // line 221
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "historywork", [], "any", false, false, false, 221)) {
                // line 222
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 224
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 226
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['recent']</code>
          ";
            // line 233
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_recent");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 236
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "recent", [], "any", false, false, false, 236))) {
                // line 237
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 239
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 241
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Persistent recently used tables:");
            // line 246
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "recentwork", [], "any", false, false, false, 246)) {
                // line 247
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 249
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 251
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['favorite']</code>
          ";
            // line 258
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_favorite");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 261
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "favorite", [], "any", false, false, false, 261))) {
                // line 262
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 264
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 266
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Persistent favorite tables:");
            // line 271
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "favoritework", [], "any", false, false, false, 271)) {
                // line 272
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 274
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 276
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['table_uiprefs']</code>
          ";
            // line 283
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_table_uiprefs");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 286
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "table_uiprefs", [], "any", false, false, false, 286))) {
                // line 287
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 289
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 291
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Persistent tables' UI preferences:");
            // line 296
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "uiprefswork", [], "any", false, false, false, 296)) {
                // line 297
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 299
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 301
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['tracking']</code>
          ";
            // line 308
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_tracking");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 311
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "tracking", [], "any", false, false, false, 311))) {
                // line 312
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 314
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 316
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Tracking:");
            // line 321
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "trackingwork", [], "any", false, false, false, 321)) {
                // line 322
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 324
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 326
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['userconfig']</code>
          ";
            // line 333
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_userconfig");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 336
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "userconfig", [], "any", false, false, false, 336))) {
                // line 337
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 339
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 341
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("User preferences:");
            // line 346
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "userconfigwork", [], "any", false, false, false, 346)) {
                // line 347
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 349
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 351
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['users']</code>
          ";
            // line 358
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_users");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 361
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "users", [], "any", false, false, false, 361))) {
                // line 362
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 364
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 366
            echo "        </td>
      </tr>
      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['usergroups']</code>
          ";
            // line 371
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_usergroups");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 374
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "usergroups", [], "any", false, false, false, 374))) {
                // line 375
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 377
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 379
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Configurable menus:");
            // line 384
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "menuswork", [], "any", false, false, false, 384)) {
                // line 385
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 387
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 389
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['navigationhiding']</code>
          ";
            // line 396
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_navigationhiding");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 399
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "navigationhiding", [], "any", false, false, false, 399))) {
                // line 400
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 402
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 404
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Hide/show navigation items:");
            // line 409
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "navwork", [], "any", false, false, false, 409)) {
                // line 410
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 412
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 414
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['savedsearches']</code>
          ";
            // line 421
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_savedsearches");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 424
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "savedsearches", [], "any", false, false, false, 424))) {
                // line 425
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 427
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 429
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Saving Query-By-Example searches:");
            // line 434
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "savedsearcheswork", [], "any", false, false, false, 434)) {
                // line 435
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 437
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 439
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['central_columns']</code>
          ";
            // line 446
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_central_columns");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 449
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "central_columns", [], "any", false, false, false, 449))) {
                // line 450
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 452
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 454
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Managing central list of columns:");
            // line 459
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "centralcolumnswork", [], "any", false, false, false, 459)) {
                // line 460
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 462
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 464
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['designer_settings']</code>
          ";
            // line 471
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_designer_settings");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 474
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "designer_settings", [], "any", false, false, false, 474))) {
                // line 475
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 477
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 479
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Remembering designer settings:");
            // line 484
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "designersettingswork", [], "any", false, false, false, 484)) {
                // line 485
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 487
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 489
            echo "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['export_templates']</code>
          ";
            // line 496
            echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_export_templates");
            echo "
        </th>
        <td class=\"text-end\">
          ";
            // line 499
            if ( !(null === twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "export_templates", [], "any", false, false, false, 499))) {
                // line 500
                echo "            <span class=\"text-success\"><strong>";
echo _pgettext("Correctly working", "OK");
                echo "</strong></span>
          ";
            } else {
                // line 502
                echo "            <span class=\"text-danger\"><strong>";
echo _gettext("not OK");
                echo "</strong></span>
          ";
            }
            // line 504
            echo "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
echo _gettext("Saving export templates:");
            // line 509
            echo "          ";
            if (twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "exporttemplateswork", [], "any", false, false, false, 509)) {
                // line 510
                echo "            <span class=\"text-success\">";
echo _gettext("Enabled");
                echo "</span>
          ";
            } else {
                // line 512
                echo "            <span class=\"text-danger\">";
echo _gettext("Disabled");
                echo "</span>
          ";
            }
            // line 514
            echo "        </td>
      </tr>
    </table>

    ";
            // line 518
            if ( !twig_get_attribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "allworks", [], "any", false, false, false, 518)) {
                // line 519
                echo "      <p>";
echo _gettext("Quick steps to set up advanced features:");
                echo "</p>

      <ul>
        <li>
          ";
                // line 523
                echo twig_sprintf(_gettext("Create the needed tables with the <code>%screate_tables.sql</code>."), twig_escape_filter($this->env, ($context["sql_dir"] ?? null)));
                echo "
          ";
                // line 524
                echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "linked-tables");
                echo "
        </li>
        <li>
          ";
echo _gettext("Create a pma user and give access to these tables.");
                // line 528
                echo "          ";
                echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_controluser");
                echo "
        </li>
        <li>
          ";
echo _gettext("Enable advanced features in configuration file (<code>config.inc.php</code>), for example by starting from <code>config.sample.inc.php</code>.");
                // line 532
                echo "          ";
                echo PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "quick-install");
                echo "
        </li>
        <li>
          ";
echo _gettext("Re-login to phpMyAdmin to load the updated configuration file.");
                // line 536
                echo "        </li>
      </ul>
    ";
            }
            // line 539
            echo "  ";
        }
        // line 540
        echo "</div>
";
    }

    public function getTemplateName()
    {
        return "relation/check_relations.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  1157 => 540,  1154 => 539,  1149 => 536,  1141 => 532,  1133 => 528,  1126 => 524,  1122 => 523,  1114 => 519,  1112 => 518,  1106 => 514,  1100 => 512,  1094 => 510,  1091 => 509,  1084 => 504,  1078 => 502,  1072 => 500,  1070 => 499,  1064 => 496,  1055 => 489,  1049 => 487,  1043 => 485,  1040 => 484,  1033 => 479,  1027 => 477,  1021 => 475,  1019 => 474,  1013 => 471,  1004 => 464,  998 => 462,  992 => 460,  989 => 459,  982 => 454,  976 => 452,  970 => 450,  968 => 449,  962 => 446,  953 => 439,  947 => 437,  941 => 435,  938 => 434,  931 => 429,  925 => 427,  919 => 425,  917 => 424,  911 => 421,  902 => 414,  896 => 412,  890 => 410,  887 => 409,  880 => 404,  874 => 402,  868 => 400,  866 => 399,  860 => 396,  851 => 389,  845 => 387,  839 => 385,  836 => 384,  829 => 379,  823 => 377,  817 => 375,  815 => 374,  809 => 371,  802 => 366,  796 => 364,  790 => 362,  788 => 361,  782 => 358,  773 => 351,  767 => 349,  761 => 347,  758 => 346,  751 => 341,  745 => 339,  739 => 337,  737 => 336,  731 => 333,  722 => 326,  716 => 324,  710 => 322,  707 => 321,  700 => 316,  694 => 314,  688 => 312,  686 => 311,  680 => 308,  671 => 301,  665 => 299,  659 => 297,  656 => 296,  649 => 291,  643 => 289,  637 => 287,  635 => 286,  629 => 283,  620 => 276,  614 => 274,  608 => 272,  605 => 271,  598 => 266,  592 => 264,  586 => 262,  584 => 261,  578 => 258,  569 => 251,  563 => 249,  557 => 247,  554 => 246,  547 => 241,  541 => 239,  535 => 237,  533 => 236,  527 => 233,  518 => 226,  512 => 224,  506 => 222,  503 => 221,  496 => 216,  490 => 214,  484 => 212,  482 => 211,  476 => 208,  467 => 201,  461 => 199,  455 => 197,  452 => 196,  445 => 191,  439 => 189,  433 => 187,  431 => 186,  425 => 183,  418 => 178,  409 => 173,  403 => 169,  401 => 168,  397 => 166,  391 => 164,  385 => 162,  382 => 161,  375 => 156,  369 => 154,  363 => 152,  360 => 151,  353 => 146,  347 => 144,  341 => 142,  339 => 141,  333 => 138,  324 => 131,  318 => 129,  312 => 127,  309 => 126,  302 => 121,  296 => 119,  290 => 117,  288 => 116,  282 => 113,  275 => 108,  269 => 106,  263 => 104,  261 => 103,  255 => 100,  246 => 93,  240 => 91,  234 => 89,  231 => 88,  224 => 83,  218 => 81,  212 => 79,  210 => 78,  204 => 75,  195 => 68,  189 => 66,  183 => 64,  180 => 63,  173 => 58,  167 => 56,  161 => 54,  159 => 53,  153 => 50,  143 => 42,  136 => 39,  129 => 34,  126 => 33,  124 => 30,  121 => 32,  118 => 31,  115 => 30,  112 => 29,  109 => 28,  106 => 27,  103 => 26,  101 => 23,  98 => 25,  95 => 24,  92 => 23,  89 => 22,  87 => 19,  84 => 21,  81 => 20,  78 => 19,  75 => 18,  73 => 17,  67 => 15,  60 => 11,  55 => 10,  51 => 8,  49 => 7,  42 => 4,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "relation/check_relations.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\relation\\check_relations.twig");
    }
}
