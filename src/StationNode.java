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
    public boolean equals(Object obj) {
        /*if (this == obj) {
            return true;
        }*/

        if (!(obj instanceof StationNode)) {
            return false;
        }

        StationNode other = (StationNode) obj;
        return this.id == other.id;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }

    @Override
    public String toString() {
        return name + " [" + line + "]";
    }
}