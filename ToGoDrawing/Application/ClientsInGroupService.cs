namespace ToGoDrawing.Application;

public class ClientsInGroupService
{
    public Dictionary<string, List<String>> Dictionary = new();

    public void CleanUnusedMemory()
    {
        foreach (var item in Dictionary)
        {
            Console.WriteLine("room: " + item.Key + " users: "  + item.Value.Count);
            
            if (item.Value.Count == 0)
            {
                Dictionary.Remove(item.Key);
                Console.WriteLine("room id " + item.Key + " has been removed");
            }
        }
    }
}