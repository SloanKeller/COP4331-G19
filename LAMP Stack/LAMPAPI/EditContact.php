<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["id"];
    $contactName = $inData["name"];
    $contactPhone = $inData["phone"];
    $contactEmail = $inData["email"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE ID=?");
		$stmt->bind_param("ssss", $contactName, $contactPhone, $contactEmail, $contactId);
		$stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithError("");
        } else {
            returnWithError("No contact found or unable to update contact or no changes made.");
        }

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>