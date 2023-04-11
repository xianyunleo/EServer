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

/* login/footer.twig */
class __TwigTemplate_511ff0a99684e9a5edb459b5a5982c8b716a21b29cd83eacf423c1303587e58b extends Template
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
        echo "</div>
";
        // line 2
        if ((0 === twig_compare(($context["check_timeout"] ?? null), true))) {
            // line 3
            echo "    </div>
";
        }
    }

    public function getTemplateName()
    {
        return "login/footer.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  42 => 3,  40 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "login/footer.twig", "E:\\my\\EasySrv\\extra\\win32\\core\\software\\tool\\phpMyAdmin\\templates\\login\\footer.twig");
    }
}
