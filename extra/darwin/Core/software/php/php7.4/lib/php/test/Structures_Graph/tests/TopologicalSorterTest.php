<?php
require_once dirname(__FILE__) . '/helper.inc';
require_once 'Structures/Graph/Manipulator/TopologicalSorter.php';

class TopologicalSorterTest extends PHPUnit_Framework_TestCase
{
    public function testSort()
    {
        $graph = new Structures_Graph();

        $name1 = 'node1';
        $node1 = new Structures_Graph_Node();
        $node1->setData($name1);
        $graph->addNode($node1);

        $name11 = 'node11';
        $node11 = new Structures_Graph_Node();
        $node11->setData($name11);
        $graph->addNode($node11);
        $node1->connectTo($node11);

        $name12 = 'node12';
        $node12 = new Structures_Graph_Node();
        $node12->setData($name12);
        $graph->addNode($node12);
        $node1->connectTo($node12);

        $name121 = 'node121';
        $node121 = new Structures_Graph_Node();
        $node121->setData($name121);
        $graph->addNode($node121);
        $node12->connectTo($node121);

        $name2 = 'node2';
        $node2 = new Structures_Graph_Node();
        $node2->setData($name2);
        $graph->addNode($node2);

        $name21 = 'node21';
        $node21 = new Structures_Graph_Node();
        $node21->setData($name21);
        $graph->addNode($node21);
        $node2->connectTo($node21);

        $nodes = Structures_Graph_Manipulator_TopologicalSorter::sort($graph);
        $this->assertCount(2, $nodes[0]);
        $this->assertEquals('node1', $nodes[0][0]->getData());
        $this->assertEquals('node2', $nodes[0][1]->getData());

        $this->assertCount(3, $nodes[1]);
        $this->assertEquals('node11', $nodes[1][0]->getData());
        $this->assertEquals('node12', $nodes[1][1]->getData());
        $this->assertEquals('node21', $nodes[1][2]->getData());

        $this->assertCount(1, $nodes[2]);
        $this->assertEquals('node121', $nodes[2][0]->getData());
    }
}
?>
