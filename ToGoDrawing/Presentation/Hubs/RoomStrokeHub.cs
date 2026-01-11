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
            if (!string.IsNullOrWhiteSpace(roomid) || !string.IsNullOrWhiteSpace(username) || strokes.Count != 0)
            {
                _roomPersistence.AddToDictionary(roomid, username, strokes);
                var returnDictionary = _roomPersistence.GetRoomDictionary(roomid);
                await Clients.OthersInGroup(roomid).SendAsync("ReceiveStrokes", username, returnDictionary);
            }
            else
            {
               Console.WriteLine("SendStrokesServer is not receiving valid data from user " + username);
            }
        }

        public async Task<string> CreateRoom(string username, List<StrokeDto> strokes)
        {
            if (!string.IsNullOrWhiteSpace(username) || strokes.Count != 0)
            {
                Guid randomid = Guid.NewGuid();
                _roomPersistence.CreatePersistence(randomid.ToString(), username, strokes);
                await Groups.AddToGroupAsync(Context.ConnectionId, randomid.ToString());
                return randomid.ToString(); 
            }
            else
            {
                Console.WriteLine("CreateRoom is not receiving valid data from user " + username);
                   return null;
            }
            
        }

        public async Task JoinRoom(string roomid)
        {
            if (_roomPersistence.GetRoomDictionary(roomid) != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, roomid);
            }
            else
            {
                Console.WriteLine("Room ID =  " + roomid + "not exists");
            }
            
        }

        public async Task  RenewRoom(string roomid)
        {
            var data = _roomPersistence.GetRoomDictionary(roomid);
            if (data != null)
            {
                await Clients.Caller.SendAsync("ReceiveStrokes", "",  data );
            }
            else
            {
                Console.WriteLine("It is not possible to renew the room, the roomID does not exist.");
            }
        }
    }
}

 