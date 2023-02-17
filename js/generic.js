const IsLocal = true;
const HostName = IsLocal ? "http://127.0.0.1:5500" : "https://juan327.github.io/JuanApp";
const TimeUtcHours = -300;

async function GetUser() {
    const Users = await GetTable("Users");
    if(Users == undefined) {
        return;
    }
    const UserId = localStorage.getItem("UserId");
    if(UserId != undefined) {
        return Users.find(c=>c.UserId == UserId);
    } else {
        return undefined;
    }
}

async function GetRole(RoleId) {
    const Roles = await GetTable("Roles");
    if(Roles == undefined) {
        return;
    }
    
    if(RoleId != undefined) {
        return Roles.find(c=>c.RoleId == RoleId);
    } else {
        return undefined;
    }
}

async function IsLogin() {
    const User = await GetUser();
    const result = User != undefined;
    return result;
}

function SerializeForm(form) {
    // Get all field data from the form
    let data = new FormData(form);

    // Convert to an object
    return SerializeFormData(data);
}

function SerializeFormData (formData) {
    let obj = {};
    for (let [key, value] of formData) {
        
        if (obj[key] !== undefined) {
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]];
            }
            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    }
    return obj;
}

function GetTable(tableName) {
    const filePath = HostName + "/db/" + tableName + ".json";

    return fetch(filePath).then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Something went wrong');
      })
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.log(error);
      });
}


function CopiarAlPortapapeles(text) {
    var aux = document.createElement("input");
    aux.setAttribute("value", text);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

function RedirectToUrl(url) {
    var link = document.createElement('a');
    link.href = url;
    link.click();
}
  
function DownloadByteArray(name, byte) {
    var link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + byte;
    link.download = name;
    link.target = '_blank';
    link.click();
}

function ShowModalMessage(text, icon) {
    Swal.fire({
        icon: icon,
        title: text,
    })
}

function ShowMessage(text, icon, position) {
 
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: 3000,
    })
    
    Toast.fire({
        icon: icon,
        title: text,
    })
}

function GenerateGuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function GetDateTimeUtcNow() {
    const DateTime = new Date();
    const Year = DateTime.getUTCFullYear().toString().padStart(4, 0);
    const Month = (DateTime.getUTCMonth() + 1).toString().padStart(2, 0);
    const Day = DateTime.getUTCDate().toString().padStart(2, 0);
    const Hour = DateTime.getUTCHours().toString().padStart(2, 0);
    const Minute = DateTime.getUTCMinutes().toString().padStart(2, 0);
    const Second = DateTime.getUTCSeconds().toString().padStart(2, 0);
    
    return Year + "," + Month + "," + Day + "," + Hour + "," + Minute + "," + Second;
}

function GetDateTimeString(DateTime) {
    const Year = DateTime.getUTCFullYear().toString().padStart(4, 0);
    const Month = (DateTime.getUTCMonth() + 1).toString().padStart(2, 0);
    const Day = DateTime.getUTCDate().toString().padStart(2, 0);
    const Hour = DateTime.getUTCHours().toString().padStart(2, 0);
    const Minute = DateTime.getUTCMinutes().toString().padStart(2, 0);
    const Second = DateTime.getUTCSeconds().toString().padStart(2, 0);
    
    return Year + "," + Month + "," + Day + "," + Hour + "," + Minute + "," + Second;
}

function AddHours(dateTime, hours) {
    dateTime.setHours(dateTime.getHours() + hours);
    return dateTime;
}

function AddMinutes(dateTime, minutes) {
    return new Date(dateTime.getTime() + minutes * 60000);
}

function UpdateTable(tableName, jsonList) {
    //const filePath = HostName + "/db/" + tableName + ".json";
    const content = JSON.stringify(jsonList);
    const fileName = tableName + ".json";
    const a = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function ParseDateTime(dateTimeString) {
    const ListTemp = dateTimeString.split(",");
    switch (ListTemp.length) {
        case 3:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2]);
        case 4:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2] + "T" + ListTemp[3] + ":00:00");
        case 5:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2] + "T" + ListTemp[3] + ":" + ListTemp[4] + ":00");
        case 6:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2] + "T" + ListTemp[3] + ":" + ListTemp[4] + ":" + ListTemp[5]);
        default:
            return new Date(ListTemp[0] + "-" + ListTemp[1] + "-" + ListTemp[2]);
    }
}

function DateTimeStringToString(dateTimeString, format) {
    const ListTemp = dateTimeString.split(",");
    switch (format) {
        case "dd/MM/yyyy":
            return ListTemp[0] + "/" + ListTemp[1] + "/" + ListTemp[2];
        case "dd/MM/yyyy HH":
            return ListTemp[0] + "/" + ListTemp[1] + "/" + ListTemp[2] + " " + ListTemp[3];
        case "dd/MM/yyyy HH:mm":
            return ListTemp[0] + "/" + ListTemp[1] + "/" + ListTemp[2] + " " + ListTemp[3] + ":" + ListTemp[4];
        case "dd/MM/yyyy HH:mm:ss":
            return ListTemp[0] + "/" + ListTemp[1] + "/" + ListTemp[2] + " " + ListTemp[3] + ":" + ListTemp[4] + ":" + ListTemp[5];
        default:
            return ListTemp[0] + "/" + ListTemp[1] + "/" + ListTemp[2];
    }
}

function DateTimeToString(DateTime, format) {
    const Year = DateTime.getFullYear().toString().padStart(4, 0);
    const Month = (DateTime.getMonth() + 1).toString().padStart(2, 0);
    const Day = DateTime.getDate().toString().padStart(2, 0);
    const Hour = DateTime.getHours().toString().padStart(2, 0);
    const Minute = DateTime.getMinutes().toString().padStart(2, 0);
    const Second = DateTime.getSeconds().toString().padStart(2, 0);
    switch (format) {
        case "dd/MM/yyyy":
            return Year + "/" + Month + "/" + Day;
        case "dd/MM/yyyy HH":
            return Year + "/" + Month + "/" + Day + " " + Hour;
        case "dd/MM/yyyy HH:mm":
            return Year + "/" + Month + "/" + Day + " " + Hour + ":" + Minute;
        case "dd/MM/yyyy HH:mm:ss":
            return Year + "/" + Month + "/" + Day + " " + Hour + ":" + Minute + ":" + Second;
        default:
            return Year + "/" + Month + "/" + Day;
    }
}