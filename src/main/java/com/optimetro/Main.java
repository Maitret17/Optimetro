package com.optimetro;

import com.optimetro.algorithm.Dijkstra;
import com.optimetro.model.*;


public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, RATEFREI");
        Graph graph = new Graph();

        // Line A / red
        StationNode gA = new StationNode(1, "G", "A", 1);
        StationNode aA = new StationNode(2, "A", "A", 1);
        StationNode cA = new StationNode(3, "C", "A", 1);
        StationNode dA = new StationNode(4, "D", "A", 1);

        graph.addEdge(new Edge(gA, aA, TravelType.METRO, 3, 0)); // G - A
        graph.addEdge(new Edge(aA, cA, TravelType.METRO, 2, 0)); // A - C
        graph.addEdge(new Edge(cA, dA, TravelType.METRO, 2, 0)); // C - D

        // Line B / green
        StationNode eB = new StationNode(5, "E", "B", 1);
        StationNode cB = new StationNode(6, "C", "B", 1);
        StationNode bB = new StationNode(7, "B", "B", 1);
        StationNode fB = new StationNode(8, "F", "B", 1);

        graph.addEdge(new Edge(eB, cB, TravelType.METRO, 4, 0)); // E - C
        graph.addEdge(new Edge(cB, bB, TravelType.METRO, 2, 0)); // C - B
        graph.addEdge(new Edge(bB, fB, TravelType.METRO, 4, 0)); // B - F

        // Line C / yellow
        StationNode gC = new StationNode(9, "G", "C", 1);
        StationNode eC = new StationNode(10, "E", "C", 1);
        StationNode cC = new StationNode(11, "C", "C", 1);

        graph.addEdge(new Edge(gC, eC, TravelType.METRO, 4, 0)); // G - E
        graph.addEdge(new Edge(eC, cC, TravelType.METRO, 2, 0)); // E - C

        // Transfers
        graph.addEdge(new Edge(gA, gC, TravelType.TRANSFER, 0, 0)); // G line A -> G line C
        graph.addEdge(new Edge(eB, eC, TravelType.TRANSFER, 0, 0)); // E line B -> E line C

        graph.addEdge(new Edge(cA, cB, TravelType.TRANSFER, 0, 0)); // C line A -> C line B
        graph.addEdge(new Edge(cA, cC, TravelType.TRANSFER, 0, 0)); // C line A -> C line C
        graph.addEdge(new Edge(cB, cC, TravelType.TRANSFER, 0, 0)); // C line B -> C line C

        System.out.println(Dijkstra.shortestPath(graph, aA, fB, CostType.TIME));
    }
}