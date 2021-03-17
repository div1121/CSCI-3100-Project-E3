<head>
	<script>
		function confirm(token, tokenId){
			try{
				await app.emailPasswordAuth.confirmUser(token, tokenId);
			} catch(error) {
				alert(error)
			}
		}
	</script>
</head>
<body
<?php
	echo 'onload="confirm('.$_GET["token",].", ".$_GET["tokenId"].')"'
?>
>
</body>