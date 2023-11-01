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

/* filter.twig */
class __TwigTemplate_b28aaaec8279c20878c32d5706d582b32f9ebd730fa2e1d5dcc660e58b8beb89 extends Template
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
        echo "<div class=\"card mb-3\" id=\"tableFilter\">
  <div class=\"card-header\">";
echo _gettext("Filters");
        // line 2
        echo "</div>
  <div class=\"card-body row row-cols-lg-auto gy-1 gx-3 align-items-center\">
    <label class=\"col-12 col-form-label\" for=\"filterText\">";
echo _gettext("Containing the word:");
        // line 4
        echo "</label>
    <div class=\"col-12\">
      <input class=\"form-control\" name=\"filterText\" type=\"text\" id=\"filterText\" value=\"";
        // line 6
        echo twig_escape_filter($this->env, ($context["filter_value"] ?? null), "html", null, true);
        echo "\">
    </div>
  </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "filter.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  50 => 6,  46 => 4,  41 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "filter.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\filter.twig");
    }
}
