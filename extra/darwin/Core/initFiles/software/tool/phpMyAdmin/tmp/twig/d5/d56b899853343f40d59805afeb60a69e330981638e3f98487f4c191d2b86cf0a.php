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

/* preferences/autoload.twig */
class __TwigTemplate_dab87ae88a834583e95444457c6955947eedcf7de2c4a43705e74ab11274e96b extends Template
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
        echo "<div id=\"prefs_autoload\" class=\"alert alert-primary d-print-none hide\" role=\"alert\">
    <form action=\"";
        // line 2
        echo PhpMyAdmin\Url::getFromRoute("/preferences/manage");
        echo "\" method=\"post\" class=\"disableAjax\">
        ";
        // line 3
        echo ($context["hidden_inputs"] ?? null);
        echo "
        <input type=\"hidden\" name=\"json\" value=\"\">
        <input type=\"hidden\" name=\"submit_import\" value=\"1\">
        <input type=\"hidden\" name=\"return_url\" value=\"";
        // line 6
        echo twig_escape_filter($this->env, ($context["return_url"] ?? null), "html", null, true);
        echo "\">
        ";
echo _gettext("Your browser has phpMyAdmin configuration for this domain. Would you like to import it for current session?");
        // line 10
        echo "        <br>
        <a href=\"#yes\">";
echo _gettext("Yes");
        // line 11
        echo "</a>
        / <a href=\"#no\">";
echo _gettext("No");
        // line 12
        echo "</a>
        / <a href=\"#delete\">";
echo _gettext("Delete settings");
        // line 13
        echo "</a>
    </form>
</div>
";
    }

    public function getTemplateName()
    {
        return "preferences/autoload.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  67 => 13,  63 => 12,  59 => 11,  55 => 10,  50 => 6,  44 => 3,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "preferences/autoload.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\preferences\\autoload.twig");
    }
}
