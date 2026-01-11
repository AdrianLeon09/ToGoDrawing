
using ToGoDrawing.Application;

namespace ToGoDrawing.Infraestructure;

public class RoomPersistence : IRoomPersistence
{
    private static Dictionary<string, Dictionary<string, List<StrokeDto>>> _dictionaryOfRoomPersistences = new();

    public RoomPersistence(){}
    
    public void CreatePersistence(string roomid, string username, List<StrokeDto> strokes)
    {
        if (!_dictionaryOfRoomPersistences.ContainsKey(roomid))
        {
         _dictionaryOfRoomPersistences.Add(roomid, new Dictionary<string, List<StrokeDto>>() {  [username] = strokes }); 
        }
        else
        {
            Console.WriteLine(roomid + "always exist");
        }
    }
    
    public void AddToDictionary(string roomid, string username, List<StrokeDto> strokeDto)
    {
        if (_dictionaryOfRoomPersistences.TryGetValue(roomid, out var key))
        {
            key[username] = strokeDto;
        }
        else{Console.WriteLine(roomid + " doesn't exist");}
    }

    public IReadOnlyDictionary<string, List<StrokeDto>> GetRoomDictionary(string roomid)
    {
        if (_dictionaryOfRoomPersistences.TryGetValue(roomid, out var data))
        {
            return data;
        }
        else
        {
           Console.WriteLine(roomid + " doesn't exist");
           return null;
        }
    }
    

}
  

