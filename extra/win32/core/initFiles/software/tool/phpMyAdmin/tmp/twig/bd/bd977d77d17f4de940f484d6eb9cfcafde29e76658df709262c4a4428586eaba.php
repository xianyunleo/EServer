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

/* database/structure/bulk_action_modal.twig */
class __TwigTemplate_dbc37838682cfa7ff088fcfe6ec79eab4d5cfe89b35d1bf3ae7966952698cc0d extends Template
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
        echo "<div class=\"modal fade\" id=\"bulkActionModal\" data-bs-backdrop=\"static\" data-bs-keyboard=\"false\"
     tabindex=\"-1\" aria-labelledby=\"bulkActionLabel\" aria-hidden=\"true\">
  <div class=\"modal-dialog modal-dialog-centered\">
    <div class=\"modal-content\">
      <div class=\"modal-header\">
        <h5 class=\"modal-title\" id=\"bulkActionLabel\"></h5>
        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
echo _gettext("Cancel");
        // line 7
        echo "\"></button>
      </div>
      <div class=\"modal-body\"></div>
      <div class=\"modal-footer\">
        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">";
echo _gettext("Cancel");
        // line 11
        echo "</button>
        <button type=\"button\" class=\"btn btn-primary\" id=\"bulkActionContinue\">";
echo _gettext("Continue");
        // line 12
        echo "</button>
      </div>
    </div>
  </div>
</div>";
    }

    public function getTemplateName()
    {
        return "database/structure/bulk_action_modal.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  57 => 12,  53 => 11,  46 => 7,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "database/structure/bulk_action_modal.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\database\\structure\\bulk_action_modal.twig");
    }
}
