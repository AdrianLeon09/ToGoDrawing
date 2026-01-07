using ToGoDrawing.Infraestructure;

namespace ToGoDrawing.Application;

public interface IRoomPersistence
{
    public void CreatePersistence(string roomid, string username, List<StrokeDto> strokes){}
    public void AddToDictionary(string roomid, string username, List<StrokeDto> strokeDto);
    public IReadOnlyDictionary<string, List<StrokeDto>> GetRoomDictionary(string roomid);
    
}