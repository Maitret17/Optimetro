public class StationNode {
    private int id;
    private String name;
    private String line;
    private int groupId; // For later usage on dijkstra

    public StationNode(int id, String name, String line) {
        this.id = id;
        this.name = name;
        this.line = line;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLine() {
        return line;
    }

    @Override
    public String toString() {
        return name + " [" + line + "]";
    }
}