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

/* database/structure/table_header.twig */
class __TwigTemplate_4aa00d3c6e450c5e624849dcce9d2173588ca8e3bb3d80c1394b072fca492c72 extends Template
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
        echo "<form method=\"post\" action=\"";
        echo PhpMyAdmin\Url::getFromRoute("/database/structure");
        echo "\" name=\"tablesForm\" id=\"tablesForm\">
";
        // line 2
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null));
        echo "
<div class=\"table-responsive\">
<table class=\"table table-striped table-hover table-sm w-auto data\">
    <thead>
        <tr>
            <th class=\"d-print-none\"></th>
            <th>";
        // line 8
        echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Table"), "table");
        echo "</th>
            ";
        // line 9
        if (($context["replication"] ?? null)) {
            // line 10
            echo "                <th>";
echo _gettext("Replication");
            echo "</th>
            ";
        }
        // line 12
        echo "
            ";
        // line 13
        if (($context["db_is_system_schema"] ?? null)) {
            // line 14
            echo "                ";
            $context["action_colspan"] = 3;
            // line 15
            echo "            ";
        } else {
            // line 16
            echo "                ";
            $context["action_colspan"] = 6;
            // line 17
            echo "            ";
        }
        // line 18
        echo "            ";
        if ((1 === twig_compare(($context["num_favorite_tables"] ?? null), 0))) {
            // line 19
            echo "                ";
            $context["action_colspan"] = (($context["action_colspan"] ?? null) + 1);
            // line 20
            echo "            ";
        }
        // line 21
        echo "            <th colspan=\"";
        echo twig_escape_filter($this->env, ($context["action_colspan"] ?? null), "html", null, true);
        echo "\" class=\"d-print-none\">
                ";
echo _gettext("Action");
        // line 23
        echo "            </th>
            ";
        // line 25
        echo "            <th>
                ";
        // line 26
        echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Rows"), "records", "DESC");
        echo "
                ";
        // line 27
        echo PhpMyAdmin\Html\Generator::showHint(PhpMyAdmin\Sanitize::sanitizeMessage(_gettext("May be approximate. Click on the number to get the exact count. See [doc@faq3-11]FAQ 3.11[/doc].")));
        echo "
            </th>
            ";
        // line 29
        if ( !(1 === twig_compare(($context["properties_num_columns"] ?? null), 1))) {
            // line 30
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Type"), "type");
            echo "</th>
                <th>";
            // line 31
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Collation"), "collation");
            echo "</th>
            ";
        }
        // line 33
        echo "
            ";
        // line 34
        if (($context["is_show_stats"] ?? null)) {
            // line 35
            echo "                ";
            // line 36
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Size"), "size", "DESC");
            echo "</th>
                ";
            // line 38
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Overhead"), "overhead", "DESC");
            echo "</th>
            ";
        }
        // line 40
        echo "
            ";
        // line 41
        if (($context["show_charset"] ?? null)) {
            // line 42
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Charset"), "charset");
            echo "</th>
            ";
        }
        // line 44
        echo "
            ";
        // line 45
        if (($context["show_comment"] ?? null)) {
            // line 46
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Comment"), "comment");
            echo "</th>
            ";
        }
        // line 48
        echo "
            ";
        // line 49
        if (($context["show_creation"] ?? null)) {
            // line 50
            echo "                ";
            // line 51
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Creation"), "creation", "DESC");
            echo "</th>
            ";
        }
        // line 53
        echo "
            ";
        // line 54
        if (($context["show_last_update"] ?? null)) {
            // line 55
            echo "                ";
            // line 56
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Last update"), "last_update", "DESC");
            echo "</th>
            ";
        }
        // line 58
        echo "
            ";
        // line 59
        if (($context["show_last_check"] ?? null)) {
            // line 60
            echo "                ";
            // line 61
            echo "                <th>";
            echo PhpMyAdmin\Util::sortableTableHeader(_gettext("Last check"), "last_check", "DESC");
            echo "</th>
            ";
        }
        // line 63
        echo "        </tr>
    </thead>
    <tbody>
    ";
        // line 66
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["structure_table_rows"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["structure_table_row"]) {
            // line 67
            echo "        ";
            $this->loadTemplate("database/structure/structure_table_row.twig", "database/structure/table_header.twig", 67)->display(twig_to_array($context["structure_table_row"]));
            // line 68
            echo "    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['structure_table_row'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 69
        echo "    </tbody>
    ";
        // line 70
        if (($context["body_for_table_summary"] ?? null)) {
            // line 71
            echo "        ";
            $this->loadTemplate("database/structure/body_for_table_summary.twig", "database/structure/table_header.twig", 71)->display(twig_to_array(($context["body_for_table_summary"] ?? null)));
            // line 72
            echo "    ";
        }
        // line 73
        echo "</table>
</div>
";
        // line 75
        if (($context["check_all_tables"] ?? null)) {
            // line 76
            echo "  ";
            $this->loadTemplate("database/structure/check_all_tables.twig", "database/structure/table_header.twig", 76)->display(twig_to_array(($context["check_all_tables"] ?? null)));
        }
        // line 78
        echo "</form>
";
        // line 79
        if (($context["check_all_tables"] ?? null)) {
            // line 80
            echo "  ";
            $this->loadTemplate("database/structure/bulk_action_modal.twig", "database/structure/table_header.twig", 80)->display(twig_to_array(($context["check_all_tables"] ?? null)));
        }
    }

    public function getTemplateName()
    {
        return "database/structure/table_header.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  245 => 80,  243 => 79,  240 => 78,  236 => 76,  234 => 75,  230 => 73,  227 => 72,  224 => 71,  222 => 70,  219 => 69,  213 => 68,  210 => 67,  206 => 66,  201 => 63,  195 => 61,  193 => 60,  191 => 59,  188 => 58,  182 => 56,  180 => 55,  178 => 54,  175 => 53,  169 => 51,  167 => 50,  165 => 49,  162 => 48,  156 => 46,  154 => 45,  151 => 44,  145 => 42,  143 => 41,  140 => 40,  134 => 38,  129 => 36,  127 => 35,  125 => 34,  122 => 33,  117 => 31,  112 => 30,  110 => 29,  105 => 27,  101 => 26,  98 => 25,  95 => 23,  89 => 21,  86 => 20,  83 => 19,  80 => 18,  77 => 17,  74 => 16,  71 => 15,  68 => 14,  66 => 13,  63 => 12,  57 => 10,  55 => 9,  51 => 8,  42 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/table_header.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\database\\structure\\table_header.twig");
    }
}
