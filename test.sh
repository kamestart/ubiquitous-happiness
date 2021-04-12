#!/bin/sh

echo `date +"%I:%M %p, %d-%m-%y"`		
echo "Welcome! What May be your Username Or Name? "

read USERNAME
echo -e "\e[1;32mWelcome $USERNAME! Please Enter Your Password.\e[0m"
read -s Password
if [ "$Password" == "https is my goal" ] 
then 
	echo -e "\e[1;32mWelcome $USERNAME! What Do You Want To Do Today?\e[0m"
	options=("Commit And Push New Code" "Fetch The Database Stuff" "Run Security Checks" "Exit")
	select opt in "${options[@]}"

	do
		case $opt in
			"Commit And Push New Code")
				echo "You chose To $opt!"
				echo "Enter Remote Name"
				read REMOTENAME
				echo "Enter Commit Name"
				read CommitName
				echo "Enter Branch Name"
				read BranchName
				git add . 
				git commit -am "$CommitName"
				git push $REMOTENAME $BranchName
				echo "Successfully Commited And Pushed To $REMOTENAME!"
				read -p "Do you wish to see the logs? " yn
					case $yn in
						 [Yy]* ) 
							start https://anskep.herokuapp.com
							heroku logs --tail; 
							break;;
						 [Nn]* )
							start https://anskep.herokuapp.com
							exit;;
							* ) echo "Please answer yes or no. ";;
					esac
				;;
			"Fetch The Database Stuff")
				echo "You chose To  $opt!"
				;;
			"Run Security Checks")
				echo "You chose To $opt!"
				;;
			 "Exit")
				  echo "Bye!"
				  break
				   ;;
			*) echo "invalid option $REPLY";;
		esac
	done
else 
	echo "Wrong Password!"
fi
