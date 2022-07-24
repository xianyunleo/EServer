<?php
require_once dirname(__FILE__) . '/helper.inc';
require_once 'Structures/Graph/Manipulator/AcyclicTest.php';

class AcyclicTestTest extends PHPUnit_Framework_TestCase
{
    public function testIsAcyclicFalse()
    {
        $graph = new Structures_Graph();
        $node1 = new Structures_Graph_Node();
        $graph->addNode($node1);

        $node2 = new Structures_Graph_Node();
        $graph->addNode($node2);
        $node1->connectTo($node2);

        $node3 = new Structures_Graph_Node();
        $graph->addNode($node3);
        $node2->connectTo($node3);

        $node3->connectTo($node1);

        $this->assertFalse(
            Structures_Graph_Manipulator_AcyclicTest::isAcyclic($graph),
            'Graph is cyclic'
        );
    }

    public function testIsAcyclicTrue()
    {
        $graph = new Structures_Graph();
        $node1 = new Structures_Graph_Node();
        $graph->addNode($node1);

        $node2 = new Structures_Graph_Node();
        $graph->addNode($node2);
        $node1->connectTo($node2);

        $node3 = new Structures_Graph_Node();
        $graph->addNode($node3);
        $node2->connectTo($node3);

        $this->assertTrue(
            Structures_Graph_Manipulator_AcyclicTest::isAcyclic($graph),
            'Graph is acyclic'
        );
    }
}
?>
