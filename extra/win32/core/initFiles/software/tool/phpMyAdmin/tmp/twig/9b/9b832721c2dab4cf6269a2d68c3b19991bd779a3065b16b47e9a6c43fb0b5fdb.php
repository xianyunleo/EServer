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

/* navigation/tree/fast_filter.twig */
class __TwigTemplate_2e8ef3fe1d93585be95f6ab5761585b310fa401468ae8fbf14632a4a28a28455 extends Template
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
        if (($context["url_params"] ?? null)) {
            // line 2
            echo "    <li class=\"fast_filter";
            if (($context["is_root_node"] ?? null)) {
                echo " db_fast_filter";
            }
            echo "\">
        <form class=\"ajax fast_filter\">
            ";
            // line 4
            echo PhpMyAdmin\Url::getHiddenInputs(($context["url_params"] ?? null));
            echo "
            <div class=\"input-group\">
              <input
                  class=\"searchClause form-control\"
                  type=\"text\"
                  name=\"";
            // line 9
            echo ((($context["is_root_node"] ?? null)) ? ("searchClause") : ("searchClause2"));
            echo "\"
                  accesskey=\"q\"
                  aria-label=\"";
echo _gettext("Type to filter these, Enter to search all");
            // line 11
            echo "\"
                  placeholder=\"";
echo _gettext("Type to filter these, Enter to search all");
            // line 12
            echo "\"
              >
              <button
                class=\"btn btn-outline-secondary searchClauseClear\"
                type=\"button\" aria-label=\"";
echo _gettext("Clear fast filter");
            // line 16
            echo "\">X</button>
            </div>
        </form>
    </li>
";
        }
    }

    public function getTemplateName()
    {
        return "navigation/tree/fast_filter.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  72 => 16,  65 => 12,  61 => 11,  55 => 9,  47 => 4,  39 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "navigation/tree/fast_filter.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\navigation\\tree\\fast_filter.twig");
    }
}
