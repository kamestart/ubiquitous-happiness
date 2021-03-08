#!/bin/sh

echo `date +"%I:%M %p, %d-%m-%y"`		
echo "Welcome! What May be your Username Or Name? "
read USERNAME
echo -e "\e[1;36mWelcome $USERNAME! What Do You Want To Do Today?\e[0m"
options=("Commit And Push New Code" "Fetch The Database Stuff" "Run Security Checks" "Test The Application" "Exit")
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
	cd Anskep
	git add . 
	git commit -am "$CommitName"
	git push $REMOTENAME $BranchName
	echo "Successfully Commited And Pushed To $REMOTENAME!"
    	read -p "Do you wish to see the logs?" yn
    	case $yn in
       		 [Yy]* ) heroku logs --tail; break;;
       		 [Nn]* ) exit;;
        		* ) echo "Please answer yes or no.";;
  	esac
	start https://anskep.herokuapp.com
            ;;
        "Fetch The Database Stuff")
            echo "You chose To  $opt!"
            ;;
        "Run Security Checks")
            echo "You chose To $opt!"
            ;;
        "Test The Application")
            echo "You Chose To $opt!"
            ;;
         "Exit")
              echo "Bye!"
              break
               ;;
        *) echo "invalid option $REPLY";;
    esac
done