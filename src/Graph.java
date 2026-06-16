import java.util.*;

public class Graph {
    private final ArrayList<Edge> edges;
    private final HashMap<StationNode, ArrayList<Edge>> adjacencyList; //dict of list with each station neighbor

    public Graph() {
        this.edges = new ArrayList<>();
        this.adjacencyList = new HashMap<>();
    }

    public void addStation(StationNode station) {
        adjacencyList.putIfAbsent(station, new ArrayList<>());
    }

    public void addEdge(Edge edge) {
        StationNode stationA = edge.getStationA();
        StationNode stationB = edge.getStationB();

        addStation(stationA); // Make sure that each station exist in the dictionary
        addStation(stationB);

        edges.add(edge);

        adjacencyList.get(stationA).add(edge);
        adjacencyList.get(stationB).add(edge);
    }

    public ArrayList<Edge> getEdges() {
        return edges;
    }

    public ArrayList<Edge> getNeighbors(StationNode station) { // return the list of edge reachable from this station, otherwise return an empty list
        return adjacencyList.getOrDefault(station, new ArrayList<>());
    }

    public Set<StationNode> getStations() { // return all the station stored in the dictionary
        return adjacencyList.keySet();
    }

    public void printGraph() {
        for (StationNode station : adjacencyList.keySet()) {
            System.out.println(station + " :");

            for (Edge edge : adjacencyList.get(station)) {
                StationNode neighbor = edge.getOtherStation(station);
                System.out.println("  -> " + neighbor + " | " + edge);
            }
        }
    }
}