public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, RATEFREI");
        Graph graph = new Graph();

        // Line A / red
        StationNode gA = new StationNode(1, "G", "A");
        StationNode aA = new StationNode(2, "A", "A");
        StationNode cA = new StationNode(3, "C", "A");
        StationNode dA = new StationNode(4, "D", "A");

        graph.addEdge(new Edge(gA, aA, TravelType.METRO, 3, 0)); // G - A
        graph.addEdge(new Edge(aA, cA, TravelType.METRO, 2, 0)); // A - C
        graph.addEdge(new Edge(cA, dA, TravelType.METRO, 2, 0)); // C - D

        // Line B / green
        StationNode eB = new StationNode(5, "E", "B");
        StationNode cB = new StationNode(6, "C", "B");
        StationNode bB = new StationNode(7, "B", "B");
        StationNode fB = new StationNode(8, "F", "B");

        graph.addEdge(new Edge(eB, cB, TravelType.METRO, 4, 0)); // E - C
        graph.addEdge(new Edge(cB, bB, TravelType.METRO, 2, 0)); // C - B
        graph.addEdge(new Edge(bB, fB, TravelType.METRO, 4, 0)); // B - F

        // Line C / yellow
        StationNode gC = new StationNode(9, "G", "C");
        StationNode eC = new StationNode(10, "E", "C");
        StationNode cC = new StationNode(11, "C", "C");

        graph.addEdge(new Edge(gC, eC, TravelType.METRO, 4, 0)); // G - E
        graph.addEdge(new Edge(eC, cC, TravelType.METRO, 2, 0)); // E - C

        // Transfers
        graph.addEdge(new Edge(gA, gC, TravelType.TRANSFER, 0, 0)); // G line A -> G line C
        graph.addEdge(new Edge(eB, eC, TravelType.TRANSFER, 0, 0)); // E line B -> E line C

        graph.addEdge(new Edge(cA, cB, TravelType.TRANSFER, 0, 0)); // C line A -> C line B
        graph.addEdge(new Edge(cA, cC, TravelType.TRANSFER, 0, 0)); // C line A -> C line C
        graph.addEdge(new Edge(cB, cC, TravelType.TRANSFER, 0, 0)); // C line B -> C line C

        graph.printGraph();
    }
}