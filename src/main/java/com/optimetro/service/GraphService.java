package com.optimetro.service;

import com.optimetro.algorithm.Kruskal;
import com.optimetro.model.*;
import org.springframework.stereotype.Service;

// For the csv
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import java.util.Collection;
import java.util.HashMap;

@Service
public class GraphService {
    private final Graph graph;
    private final HashMap<String, StationNode> stationsById;

    public GraphService() throws IOException {
        this.graph = new Graph();
        this.stationsById = new HashMap<>();
        loadCsvGraph();
        Kruskal.Acpm(this.graph,CostType.TIME).exportToCsv();

    }

    public Graph getGraph() {
        return graph;
    }

    public Collection<StationNode> getStations() {
        return stationsById.values();
    }

    public StationNode getStationById(String id) {
        return stationsById.get(id);
    }

    private void addStation(StationNode station) {
        stationsById.put(station.getId(), station);
        graph.addStation(station);
    }

    private void addBidirectionalEdge(StationNode stationA, StationNode stationB, TravelType travelType, double timeCost, double pollutionCost) {
        graph.addBidirectionalEdge(stationA, stationB, travelType, timeCost, pollutionCost);
    }

//    private void buildTestGraph() {
//        StationNode gA = new StationNode("1", "G", "A", 100);
//        StationNode aA = new StationNode("2", "A", "A", 200);
//        StationNode cA = new StationNode("3", "C", "A", 300);
//        StationNode dA = new StationNode("4", "D", "A", 400);
//
//        StationNode eB = new StationNode("5", "E", "B", 500);
//        StationNode cB = new StationNode("6", "C", "B", 300);
//        StationNode bB = new StationNode("7", "B", "B", 700);
//        StationNode fB = new StationNode("8", "F", "B", 800);
//
//        StationNode gC = new StationNode("9", "G", "C", 100);
//        StationNode eC = new StationNode("10", "E", "C", 500);
//        StationNode cC = new StationNode("11", "C", "C", 300);
//
//        addStation(gA);
//        addStation(aA);
//        addStation(cA);
//        addStation(dA);
//        addStation(eB);
//        addStation(cB);
//        addStation(bB);
//        addStation(fB);
//        addStation(gC);
//        addStation(eC);
//        addStation(cC);
//
//        addBidirectionalEdge(gA, aA, TravelType.METRO, 3, 0);
//        addBidirectionalEdge(aA, cA, TravelType.METRO, 2, 0);
//        addBidirectionalEdge(cA, dA, TravelType.METRO, 2, 0);
//
//        addBidirectionalEdge(eB, cB, TravelType.METRO, 4, 0);
//        addBidirectionalEdge(cB, bB, TravelType.METRO, 2, 0);
//        addBidirectionalEdge(bB, fB, TravelType.METRO, 4, 0);
//
//        addBidirectionalEdge(gC, eC, TravelType.METRO, 4, 0);
//        addBidirectionalEdge(eC, cC, TravelType.METRO, 2, 0);
//
//        addBidirectionalEdge(gA, gC, TravelType.TRANSFER, 0, 0);
//        addBidirectionalEdge(eB, eC, TravelType.TRANSFER, 0, 0);
//
//        addBidirectionalEdge(cA, cB, TravelType.TRANSFER, 0, 0);
//        addBidirectionalEdge(cA, cC, TravelType.TRANSFER, 0, 0);
//        addBidirectionalEdge(cB, cC, TravelType.TRANSFER, 0, 0);
//    }

    private void loadCsvGraph() {
        loadStationsFromCsv();
        loadEdgesFromCsv();
    }

    private void loadStationsFromCsv() {
        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("data/station_node.csv");

            if (inputStream == null) {
                throw new RuntimeException("station_node.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream, StandardCharsets.UTF_8)
            );

            reader.readLine(); // skip header

            String line;
            int groupId = 1;

            while ((line = reader.readLine()) != null) {
                String[] columns = line.split(",", -1);

                String stopId = columns[0];
                String stopName = columns[2];
                String routeName = columns[3];

                Double longitude = Double.parseDouble(columns[5]);
                Double latitude = Double.parseDouble(columns[6]);

                if (!stationsById.containsKey(stopId)) {
                    StationNode station = new StationNode(stopId, stopName, routeName, groupId, latitude, longitude);
                    addStation(station);
                    groupId++;
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error while loading station_node.csv", e);
        }
    }

    private void loadEdgesFromCsv() {
        try {
            InputStream inputStream = getClass()
                    .getClassLoader()
                    .getResourceAsStream("data/edges.csv");

            if (inputStream == null) {
                throw new RuntimeException("edges.csv not found");
            }

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream, StandardCharsets.UTF_8)
            );

            reader.readLine(); // skip header

            String line;

            while ((line = reader.readLine()) != null) {
                String[] columns = line.split(",", -1);

                int routeType = Integer.parseInt(columns[1]);
                String startStationId = columns[2];
                String endStationId = columns[3];
                double durationSeconds = Double.parseDouble(columns[4]);
                double co2 = Double.parseDouble(columns[6]);

                StationNode startStation = stationsById.get(startStationId);
                StationNode endStation = stationsById.get(endStationId);

                if (startStation == null || endStation == null) {
                    continue;
                }

                double durationMinutes = durationSeconds / 60.0;

                TravelType travelType;
                if (routeType == 6) {
                    travelType = TravelType.TRANSFER;
                } else {
                    travelType = TravelType.METRO;
                }

                graph.addEdge(new Edge(
                        startStation,
                        endStation,
                        travelType,
                        durationMinutes,
                        co2
                ));
            }

        } catch (Exception e) {
            throw new RuntimeException("Error while loading edges.csv", e);
        }
    }
}