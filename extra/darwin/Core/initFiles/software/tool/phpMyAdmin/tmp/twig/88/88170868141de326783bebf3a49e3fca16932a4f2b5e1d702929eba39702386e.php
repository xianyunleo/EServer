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

/* database/structure/index.twig */
class __TwigTemplate_ecac919d7824ecf60364c9d5adb67f433b5a798c65eed74d9bf2bef478ffebc1 extends Template
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
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->env->getRuntime('PhpMyAdmin\FlashMessages')->getMessages());
        foreach ($context['_seq'] as $context["flash_key"] => $context["flash_messages"]) {
            // line 2
            echo "  ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($context["flash_messages"]);
            foreach ($context['_seq'] as $context["_key"] => $context["flash_message"]) {
                // line 3
                echo "    <div class=\"alert alert-";
                echo twig_escape_filter($this->env, $context["flash_key"], "html", null, true);
                echo "\" role=\"alert\">
      ";
                // line 4
                echo twig_escape_filter($this->env, $context["flash_message"], "html", null, true);
                echo "
    </div>
  ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['flash_message'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['flash_key'], $context['flash_messages'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 8
        echo "
";
        // line 9
        if (($context["has_tables"] ?? null)) {
            // line 10
            echo "  <div id=\"tableslistcontainer\">
    ";
            // line 11
            echo ($context["list_navigator_html"] ?? null);
            echo "

    ";
            // line 13
            echo ($context["table_list_html"] ?? null);
            echo "

    ";
            // line 15
            echo ($context["list_navigator_html"] ?? null);
            echo "
  </div>
  <hr>
  <p class=\"d-print-none\">
    <button type=\"button\" class=\"btn btn-link p-0 jsPrintButton\">";
            // line 19
            echo PhpMyAdmin\Html\Generator::getIcon("b_print", _gettext("Print"), true);
            echo "</button>
    <a href=\"";
            // line 20
            echo PhpMyAdmin\Url::getFromRoute("/database/data-dictionary", ["db" => ($context["database"] ?? null), "goto" => PhpMyAdmin\Url::getFromRoute("/database/structure")]);
            echo "\">
      ";
            // line 21
            echo PhpMyAdmin\Html\Generator::getIcon("b_tblanalyse", _gettext("Data dictionary"), true);
            echo "
    </a>
  </p>
";
        } else {
            // line 25
            echo "  ";
            echo $this->env->getFilter('notice')->getCallable()(_gettext("No tables found in database."));
            echo "
";
        }
        // line 27
        echo "
";
        // line 28
        if ( !($context["is_system_schema"] ?? null)) {
            // line 29
            echo "  ";
            echo ($context["create_table_html"] ?? null);
            echo "
";
        }
    }

    public function getTemplateName()
    {
        return "database/structure/index.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  115 => 29,  113 => 28,  110 => 27,  104 => 25,  97 => 21,  93 => 20,  89 => 19,  82 => 15,  77 => 13,  72 => 11,  69 => 10,  67 => 9,  64 => 8,  51 => 4,  46 => 3,  41 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/index.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\database\\structure\\index.twig");
    }
}
