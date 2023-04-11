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

/* database/create_table.twig */
class __TwigTemplate_472aec46674e32762d29a4e5ac336fb96833f62fb6232507f1eb7bd41980fb1c extends Template
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
        echo "<form id=\"createTableMinimalForm\" method=\"post\" action=\"";
        echo PhpMyAdmin\Url::getFromRoute("/table/create");
        echo "\" class=\"card d-print-none lock-page\">
  ";
        // line 2
        echo PhpMyAdmin\Url::getHiddenInputs(($context["db"] ?? null));
        echo "
  <div class=\"card-header\">";
        // line 3
        echo PhpMyAdmin\Html\Generator::getIcon("b_table_add", _gettext("Create new table"), true);
        echo "</div>
  <div class=\"card-body row row-cols-lg-auto g-3\">
    <div class=\"col-12\">
      <label for=\"createTableNameInput\" class=\"form-label\">";
echo _gettext("Table name");
        // line 6
        echo "</label>
      <input type=\"text\" class=\"form-control\" name=\"table\" id=\"createTableNameInput\" maxlength=\"64\" required>
    </div>
    <div class=\"col-12\">
      <label for=\"createTableNumFieldsInput\" class=\"form-label\">";
echo _gettext("Number of columns");
        // line 10
        echo "</label>
      <input type=\"number\" class=\"form-control\" name=\"num_fields\" id=\"createTableNumFieldsInput\" min=\"1\" value=\"4\" required>
    </div>
    <div class=\"col-12 align-self-lg-end\">
      <input class=\"btn btn-primary\" type=\"submit\" value=\"";
echo _gettext("Create");
        // line 14
        echo "\">
    </div>
  </div>
</form>
";
    }

    public function getTemplateName()
    {
        return "database/create_table.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  67 => 14,  60 => 10,  53 => 6,  46 => 3,  42 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/create_table.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\database\\create_table.twig");
    }
}
