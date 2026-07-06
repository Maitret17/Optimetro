package com.optimetro.model;

import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Set;


public class Graph {
    private final ArrayList<Edge> edges;
    private final HashMap<StationNode, ArrayList<Edge>> adjacencyList;

    public Graph() {
        this.edges = new ArrayList<>();
        this.adjacencyList = new HashMap<>();
    }


    public void addStation(StationNode station) {
        adjacencyList.putIfAbsent(station, new ArrayList<>());
    }

    public void addEdge(Edge edge) {
        StationNode from = edge.getFromStation();
        StationNode to = edge.getToStation();

        addStation(from);
        addStation(to);

        edges.add(edge);

        // Directed edge: only from -> to
        adjacencyList.get(from).add(edge);
    }

    public void addBidirectionalEdge(StationNode stationA, StationNode stationB, TravelType travelType, double timeCost, double pollutionCost) {
        addEdge(new Edge(stationA, stationB, travelType, timeCost, pollutionCost));
        addEdge(new Edge(stationB, stationA, travelType, timeCost, pollutionCost));
    }

    public ArrayList<Edge> getEdges() {
        return edges;
    }

    public ArrayList<Edge> getNeighbors(StationNode station) {
        return adjacencyList.getOrDefault(station, new ArrayList<>());
    }

    public Set<StationNode> getStations() {
        return adjacencyList.keySet();
    }

    public void printGraph() {
        for (StationNode station : adjacencyList.keySet()) {
            System.out.println(station + " :");

            for (Edge edge : adjacencyList.get(station)) {
                System.out.println("  -> " + edge.getToStation() + " | " + edge);
            }
        }
    }
    public void exportToCsv() throws IOException {

        String nodesFile= "nodes.csv";
        String edgesFile="edges.csv";
        try (PrintWriter out = new PrintWriter(new FileWriter(nodesFile))) {

            out.println("Id,Label,Line,Latitude,Longitude");

            for (StationNode station : getStations()) {
                out.printf(Locale.US,"%s,%s,%s,%f,%f%n",
                        station.getId(),
                        station.getName(),
                        station.getLine(),
                        station.getLatitude(),
                        station.getLongitude());
            }
        }


        try (PrintWriter out = new PrintWriter(new FileWriter(edgesFile))) {

            out.println("Source,Target,Type,TravelType,TimeCost,PollutionCost,Weight");

            for (Edge edge : getEdges()) {
                out.printf(Locale.US,"%s,%s,Directed,%s,%f,%f,%f%n",
                        edge.getFromStation().getId(),
                        edge.getToStation().getId(),
                        edge.getTravelType(),
                        edge.getTimeCost(),
                        edge.getPollutionCost(),
                        edge.getTimeCost());
            }
        }
    }
}