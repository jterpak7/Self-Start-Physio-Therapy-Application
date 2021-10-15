How To Run Our Project:

Our MEAN Stack project requires you to configure both the frontend and backend to run
the application.

Backend Steps:
1. navigate to backend folder (ie cd backend)
2. run command npm install
3. run ./rundb in the terminal to start the mongo server(if this doesnt work, run npm install mongodb to get mongodb)
4. open another terminal and run node server.js to start the server
5. You have now turned on the server. You will know this is right if you see
the message "Magic happens on port 8082"


Frontend Steps:
1. navigate to frontend folder(ie. cd frontend)
2. run command npm install
3. You must change the proxy (which is in the file proxy.conf.json) before starting your application, if you are running both the 
server and frontend locally, then navigate to the proxy.conf.json file in the frontend folder and change
the existing proxy to http://localhost:8082
4. run command npm start
5. make sure you have the angular cli downloaded on your machine
if you do no not know if you have it, type which ng
to download angular cli run npm install -g @angular/cli
6. Once the npm start has completed, navigate to http://localhost:8080 to view the application


Restore Mongodb from mongodump
 - One of the things required was to include a mongo dump
 - this dump is included in the folder Database/backup.
 - Guide to restore the mongo dum https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/
 - 
 

Important Information For SE3350 Tester: to be able to access the features of this site, you will need to have valid accounts. For the 
physio and client, you can create one yourself or choose to use one we already have.

NOTE this will only work if you have restored the supplied mongo dumb properly

Client: username - clientcraig
        password - 123
        
Physiotherapist: username - physiosam   
                 password - 123
                 
For the administrator, one cannot be created but instead an already registered one needs to be used

Admin: username - adminsam  
       password - selfstart