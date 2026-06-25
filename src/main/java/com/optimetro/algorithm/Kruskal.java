package com.optimetro.algorithm;

import com.optimetro.model.CostType;
import com.optimetro.model.Edge;
import com.optimetro.model.Graph;
import com.optimetro.model.StationNode;

import java.awt.*;
import java.util.ArrayList;
import java.util.Comparator;

public class Kruskal {
    public static Graph Acpm(Graph graph, CostType costType){
        ArrayList<Edge> edges = graph.getEdges();
        edges.sort(Comparator.comparingDouble(o -> o.getCost(costType)));
        int n = 0;
        int group = 0;
        Graph acpm = new Graph();
        for(Edge e : edges){
            e.getStationA().setGroupId(-1);
            e.getStationB().setGroupId(-1);
        }
        while (n<edges.size()){

            boolean hasStationA = acpm.getStations().contains(edges.get(n).getStationA());
            boolean hasStationB = acpm.getStations().contains(edges.get(n).getStationB());
            if(!hasStationA && !hasStationB){
                acpm.addEdge(edges.get(n));
                edges.get(n).getStationB().setGroupId(group);
                edges.get(n).getStationB().setGroupId(group);
                acpm.addStation(edges.get(n).getStationA());
                acpm.addStation(edges.get(n).getStationB());
                group+=1;
            } else if (hasStationB!=hasStationA) {
                acpm.addEdge(edges.get(n));
                if(hasStationA){
                    edges.get(n).getStationB().setGroupId(edges.get(n).getStationA().getGroupId());
                    acpm.addStation(edges.get(n).getStationB());
                }
                else{
                    edges.get(n).getStationA().setGroupId(edges.get(n).getStationB().getGroupId());
                    acpm.addStation(edges.get(n).getStationA());
                }

            }
            else{
                int ga = edges.get(n).getStationA().getGroupId();
                int gb= edges.get(n).getStationB().getGroupId();
                if(ga!=gb){
                    for(StationNode s : acpm.getStations()){
                        if(s.getGroupId()==gb && s.getGroupId()!=-1) {
                            s.setGroupId(ga);
                        }
                    }
                }
                //group+=1;
            }
            n+=1;

        }
        return acpm;
    }

}
