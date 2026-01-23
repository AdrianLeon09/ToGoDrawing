namespace ToGoDrawing.Application;

public class ClientsInGroupService(IRoomPersistence RoomPersistence)
{
    public Dictionary<string, List<String>> Dictionary = new();
    private IRoomPersistence _roomPersistence = RoomPersistence;

    public void CleanUnusedMemory()
    {
        foreach (var item in Dictionary)
        {
            Console.WriteLine("room: " + item.Key + " users: "  + item.Value.Count);
            
            if (item.Value.Count == 0)
            {
                _roomPersistence.GetRoomDictionaryState().Remove(item.Key);
                Dictionary.Remove(item.Key);
                Console.WriteLine("room id " + item.Key + " has been removed");
            }
        }
    }
}