package com.optimetro.service;

import com.optimetro.model.*;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;

@Service
public class GraphService {
    private final Graph graph;
    private final HashMap<Integer, StationNode> stationsById;

    public GraphService() {
        this.graph = new Graph();
        this.stationsById = new HashMap<>();
        buildTestGraph();
    }

    public Graph getGraph() {
        return graph;
    }

    public Collection<StationNode> getStations() {
        return stationsById.values();
    }

    public StationNode getStationById(int id) {
        return stationsById.get(id);
    }

    private void addStation(StationNode station) {
        stationsById.put(station.getId(), station);
        graph.addStation(station);
    }

    private void addEdge(Edge edge) {
        graph.addEdge(edge);
    }

    private void buildTestGraph() {
        StationNode gA = new StationNode(1, "G", "A", 100);
        StationNode aA = new StationNode(2, "A", "A", 200);
        StationNode cA = new StationNode(3, "C", "A", 300);
        StationNode dA = new StationNode(4, "D", "A", 400);

        StationNode eB = new StationNode(5, "E", "B", 500);
        StationNode cB = new StationNode(6, "C", "B", 300);
        StationNode bB = new StationNode(7, "B", "B", 700);
        StationNode fB = new StationNode(8, "F", "B", 800);

        StationNode gC = new StationNode(9, "G", "C", 100);
        StationNode eC = new StationNode(10, "E", "C", 500);
        StationNode cC = new StationNode(11, "C", "C", 300);

        addStation(gA);
        addStation(aA);
        addStation(cA);
        addStation(dA);
        addStation(eB);
        addStation(cB);
        addStation(bB);
        addStation(fB);
        addStation(gC);
        addStation(eC);
        addStation(cC);

        addEdge(new Edge(gA, aA, TravelType.METRO, 3, 0));
        addEdge(new Edge(aA, cA, TravelType.METRO, 2, 0));
        addEdge(new Edge(cA, dA, TravelType.METRO, 2, 0));

        addEdge(new Edge(eB, cB, TravelType.METRO, 4, 0));
        addEdge(new Edge(cB, bB, TravelType.METRO, 2, 0));
        addEdge(new Edge(bB, fB, TravelType.METRO, 4, 0));

        addEdge(new Edge(gC, eC, TravelType.METRO, 4, 0));
        addEdge(new Edge(eC, cC, TravelType.METRO, 2, 0));

        addEdge(new Edge(gA, gC, TravelType.TRANSFER, 0, 0));
        addEdge(new Edge(eB, eC, TravelType.TRANSFER, 0, 0));

        addEdge(new Edge(cA, cB, TravelType.TRANSFER, 0, 0));
        addEdge(new Edge(cA, cC, TravelType.TRANSFER, 0, 0));
        addEdge(new Edge(cB, cC, TravelType.TRANSFER, 0, 0));
    }
}