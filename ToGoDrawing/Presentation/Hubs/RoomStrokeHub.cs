using Microsoft.AspNetCore.SignalR;
using ToGoDrawing.Application;
using ToGoDrawing.Domain;
using ToGoDrawing.Infraestructure;

namespace ToGoDrawing.Presentation.Hubs
{
    public class RoomStrokeHub(IRoomPersistence roomPersistence) : Hub
    {
        private IRoomPersistence _roomPersistence = roomPersistence;

        public async Task SendStrokesServer(string roomid, string username, List<StrokeDto> strokes)
        {
            _roomPersistence.AddToDictionary(roomid, username, strokes);
            var returnDictionary = _roomPersistence.GetRoomDictionary(roomid);
            await Clients.OthersInGroup(roomid).SendAsync("ReceiveStrokes", username, returnDictionary);
        }

        public async Task<string> CreateRoom(string username, List<StrokeDto> strokes)
        {
            Guid randomid = Guid.NewGuid();
            _roomPersistence.CreatePersistence(randomid.ToString(), username, strokes);
            await Groups.AddToGroupAsync(Context.ConnectionId, randomid.ToString());
            return randomid.ToString();
        }

        public async Task JoinRoom(string roomid)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomid);
        }

        public async Task  RenewRoom(string roomid)
        {
            var data = _roomPersistence.GetRoomDictionary(roomid);
            await Clients.Caller.SendAsync("ReceiveStrokes", "",  data );
        }


    }
}
 