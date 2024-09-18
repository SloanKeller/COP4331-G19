const urlBase = 'http://cop4331-g19.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}



function doSignUp()
{
	userId = 0;
	
	let firstName = document.getElementById("signupFirstName").value;
	let lastName = document.getElementById("signupLastName").value;
	let login = document.getElementById("signupUserName").value;
	let password = document.getElementById("signupPassword").value;
//	var hash = md5( password );
	
	if (!firstName || !lastName || !login || !password) 
	{
		document.getElementById("signupResult").innerHTML = "Please fill out all fields.";
		return;
	}
	
	document.getElementById("signupResult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/SignUp.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("signupResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}

}

function searchContact()
        {
            let srch = document.getElementById("searchText").value;

            document.getElementById("contactSearchResult").innerHTML = "";
            
            let contactList = "";

            let tmp = {search:srch,userId:userId};
            let jsonPayload = JSON.stringify( tmp );

            let url = urlBase + '/SearchContact.' + extension;
            
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            try
            {
                xhr.onreadystatechange = function() 
                {
                    if (this.readyState == 4 && this.status == 200) 
                    {
                        //document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                        
						let jsonObject = JSON.parse(xhr.responseText);
                        console.log(JSON.stringify(jsonObject));


                        if(jsonObject.results.length > 0)
						{
								contactList += '<table class = "table table-bordered"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>';
								for( let i=0; i<jsonObject.results.length; i++ )
								{
									contactList += '<tr id = "tr-' + i +'">';
									contactList += '<td>' + jsonObject.results[i].Name + '</td>';
									contactList += '<td>' + jsonObject.results[i].Email + '</td>';
									contactList += '<td>' + jsonObject.results[i].Phone + '</td>';
									contactList += '<td style = "display:none;" id = "' + i + '">' + jsonObject.results[i].ID + '</td>';
									contactList += '<td>';
									contactList += '<button id = "editButton' + i + '" class = "btn" type = "button" title = "Edit Contact" onclick = "editContact('+ i +');"><i class = "fa fa-edit" style = "color:blue;"></i></button>';
									contactList += '<button id = "saveButton' + i + '" class = "btn" style = "display:none;" type = "button" title = "Save Contact" onclick = "saveChanges(' + i + ');"><i class = "fa fa-save" style = "color:green;"></i></button>';
									contactList += '<button id = "deleteButton' + i + '" class = "btn" type = "button" title = "Delete Contact" onclick = "deleteContact(' + i + ');"><i class = "fa fa-trash" style = "color:red;"></i></button>';  
									contactList += '</td>'
									contactList += '</tr>';
									
								}

                            contactList += '</tbody></table>'
                            
                            document.getElementById("contactList").innerHTML = contactList;
                        }
                        else
                        {
                            document.getElementById("contactList").innerHTML = "No contacts associated with this user. Please Add to get started";
                        }
                    }
                };
                xhr.send(jsonPayload);
            }
            catch(err)
            {
                document.getElementById("contactSearchResult").innerHTML = err.message;
            }
            
        }


function editContact(id)
{
	console.log("we are editing the " + (id+1) + " row");

	let eBtn = document.getElementById(`editButton${id}`);
	eBtn.style.display = "none";
			
	let row = document.getElementById(`tr-${id}`);
	console.log(row);

	let cells = row.getElementsByTagName("td");
	console.log(cells);

	let name = cells[0].innerText;
	let email = cells[1].innerText;
	let phone = cells[2].innerText;
		

	let newName = `<input type = "text" class = "form-control" value = ${name} class = "edits" id = "editName${id}" required>`;
	let newEmail = `<input type = "text" class = "form-control" value = ${email} class = "edits" id = "editEmail${id}" required>`;
	let newPhone = `<input type = "text" class = "form-control" value = ${phone} class = "edits" id = "editPhone${id}" required>`;

	cells[0].innerHTML=newName;
	cells[1].innerHTML=newEmail;
	cells[2].innerHTML=newPhone;

		   
	eBtn.style.display = "none";

	let deleteButton = document.getElementById(`deleteButton${id}`);

	deleteButton.style.display = "none";

	let saveButton = document.getElementById(`saveButton${id}`);

	saveButton.style.display = "inline-block";

}	

function saveChanges(id)
{
    console.log("Let's save the changes");

    let editedName = document.getElementById(`editName${id}`).value;
	let editedEmail = document.getElementById(`editEmail${id}`).value;
    let editedPhone = document.getElementById(`editPhone${id}`).value;           

    let contactId = document.getElementById(`${id}`).innerText;
                
    console.log(editedName);
    console.log(editedEmail);
    console.log(editedPhone);

                
    let tmp = {id:contactId,name:editedName,phone:editedPhone,email:editedEmail};

    let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/EditContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			                
            {
                let jsonObject = JSON.parse(xhr.responseText);
                console.log(JSON.stringify(jsonObject));

                
                let eBtn = document.getElementById(`editButton${id}`);
                let dBtn = document.getElementById(`deleteButton${id}`);
                let sBtn = document.getElementById(`saveButton${id}`);

                eBtn.style.display = "inline-block";
                dBtn.style.display = "inline-block";
                sBtn.style.display = "none";

                console.log("contact has been edited successfully");
				searchContact();

                                    
            }  
        }
        xhr.send(jsonPayload);            
    }
    catch(err)
	{
        console.log(err.message);
	}
}

function deleteContact(id)
{
    console.log("we are deleting a contact")
    let rows = document.getElementById(`tr-${id}`);
    let cells = rows.getElementsByTagName("td");

    let result = confirm("Are you sure you want to delete " + cells[0].innerHTML + " from your contacts list?");
                
    if(result === true)
    {
        let contactId = document.getElementById(`${id}`).innerText;
        console.log(contactId);

        let tmp = 
                {
                	id:contactId
                };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        try 
        {
            xhr.onreadystatechange = function () 
			{
                if (this.readyState == 4 && this.status == 200) 
                {
                    console.log("Contact has been deleted");
                    searchContact();
                }
            };
            xhr.send(jsonPayload);
        } 
        catch (err) 
        {
            console.log(err.message);
        }

    }
}

function addContact() 
{

    let Name = document.getElementById("contactTextName").value;  
    let Phone = document.getElementById("contactTextPhone").value;
    let Email = document.getElementById("contactTextEmail").value;
    let tmp = 
            {
                name: Name,
                phone: Phone,
                email: Email,
                userID: userId
            };
                
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/CreateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
    {
        xhr.onreadystatechange = function () 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                console.log("Contact has been added");
                searchContact();
            }
        };
		xhr.send(jsonPayload);
    }
    catch(err)
    {
        console.log(err.message);
    }
}

function validAddContact(firstName, lastName, phone, email) {

    var firstVAl = lastVal = phoneVal = emailVAl = true;

    if (firstName == ("")) {
        console.log("Please Enter a First Name")
    }
    else {
        console.log("First Name is valid")
        firstVAl = false;
    }

    if (lastName == ("")) {
        console.log("Please Enter a Last Name")
    }
    else {
        console.log("Last Name is valid")
        lastVAl = false;
    }

    if (phone == ("")) {
        console.log("Please Enter a Phone Number")
    }
    else {

        var regExp = /^[\+]?[0-9]{0,3}\W?+[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

        if (regExp.test(phone) == false) {
            console.log("Plese enter a vlid phone number");
        }
        else {

            console.log("Phone number is valid");
            phoneVAl = false;
        }
    }

    if (email == ("")) {
        console.log("Please Enter an Email")
    }
    else {
        if (isValidEmail(email)) {
            emailVAl = false;
        }
        else {
            console.log("Please Enter a vlid Email")
        }
    }

    return true;
}

function validSignUpForm(fName, lName, user, pass) {

    var fNameErr = lNameErr = userErr = passErr = true;

    if (fName == "") {
        console.log("FIRST NAME IS BLANK");
    }
    else {
        console.log("first name IS VALID");
        fNameErr = false;
    }

    if (lName == "") {
        console.log("LAST NAME IS BLANK");
    }
    else {
        console.log("LAST name IS VALID");
        lNameErr = false;
    }

    if (user == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;

        if (regex.test(user) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            userErr = false;
        }
    }

    if (pass == "") {
        console.log("PASSWORD IS BLANK");
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(pass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            passErr = false;
        }
    }

    if ((fNameErr || lNameErr || userErr || passErr) == true) {
        return false;

    }

    return true;
}

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

