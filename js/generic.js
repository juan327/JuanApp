const HostName = window.location.origin;
console.log(window.location);

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