<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["id"];
    $contactName = $inData["name"];
    $contactPhone = $inData["phone"];
    $contactEmail = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET Name=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
		$stmt->bind_param("sssss", $contactName, $contactPhone, $contactEmail, $contactId, $userId);
		$stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithError("");
        } else {
            returnWithError("No contact found or unable to update contact.");
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