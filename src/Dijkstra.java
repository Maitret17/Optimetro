import java.util.*;

public class Dijkstra {
    public static ArrayList<Edge> shortestPath(Graph graph, StationNode startStation, StationNode endStation,CostType costType) {
        ArrayList<Edge> path = new ArrayList<>();
        if( !(graph.getStations().contains(startStation) && graph.getStations().contains(endStation))){
            return path;
        }

        HashSet<StationNode> visited = new HashSet<>();

        HashMap<StationNode, Double> costTable = new HashMap<>();
        HashMap<StationNode, Edge> fromTable = new HashMap<>();
        costTable.put(startStation,0.0);


        StationNode n = startStation;
        while (!n.equals(endStation)) {
            for (Edge edge : graph.getNeighbors(n)) {
                    StationNode s;
                    if (edge.getStationA().equals(n)) {
                        s = edge.getStationB();
                    } else {
                        s = edge.getStationA();
                    }
                    if (costTable.containsKey(s)) {
                        if (costTable.get(s) > costTable.get(n) + edge.getCost(costType)) {
                            costTable.put(s, costTable.get(n) + edge.getCost(costType));
                            fromTable.put(s,edge);
                        }
                    } else {
                        costTable.put(s, costTable.get(n) + edge.getCost(costType));
                        fromTable.put(s,edge);
                    }
            }

            double minimumCost = 10000000000000.0;
            for(StationNode s : costTable.keySet()){
               if(minimumCost>costTable.get(s) && !visited.contains(s)){
                   n=s;
                   minimumCost=costTable.get(s);
               }
            }
            visited.add(n);
        }
        StationNode currentStation = endStation;

        while (!currentStation.equals(startStation)){
            StationNode s;
            if(fromTable.get(currentStation).getStationA().equals(currentStation)){
                s = fromTable.get(currentStation).getStationB();
            }
            else{
                s = fromTable.get(currentStation).getStationA();
            }
            path.add(fromTable.get(currentStation));
            currentStation=s;


        }

        path.reversed();
        return path;
    }
}