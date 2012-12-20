import os
import datetime
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import db






#----------------------------------------models--------------------------------------

class Note(db.Model):
    author = db.UserProperty()
    title = db.StringProperty(multiline=True)
    body = db.TextProperty()
    #date = db.DateTimeProperty(auto_now_add=True)
    date = db.DateProperty()
    

#class MUser(db.Model,db.UserProperty):
#    googleUser = db.UserProperty()
#    registrationDate = db.DateTimeProperty(auto_now_add=True)







#----------------------------------------controllers--------------------------------------

__view__ = os.path.join( os.path.dirname(__file__),'view')


class MainPage(webapp.RequestHandler):
    def get(self):

        user = users.get_current_user()
            
        #if the user is logged
        if user:
            
            #search for date                  
            if not self.request.get('date'):
                #note_date=datetime.date.today()               
                #note_date= datetime.datetime.utcnow().date()
                self.redirect("/today")
                return
                
            #we get the date parameter
            try:
                note_date = datetime.datetime.strptime(self.request.get('date'),"%Y-%m-%d").date()   
            except ValueError:
                self.redirect("/today")
                return
            
            #search for note
            note = Note.all().filter('author =', user).filter('date =', note_date ).get() 
            
            #if we don't find the note create new note
            if not note:
                note = Note()
                note.author = user
                note.date = note_date
          
            #logout link
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'

            
            #values for templates
            template_values = {
               'user':user,
                'note': note,
                'datestring': note.date.strftime("%B %d, %Y"),
                'url': url,
                'url_linktext': url_linktext,
                }
    
            #write the page
            path = os.path.join(__view__, 'note.html')
            self.response.out.write(template.render(path, template_values))

        #if isn't logged
        else:
            
            #url login
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
            
            
            #values for templates
            template_values = {
                'url': url,
                'url_linktext': url_linktext,
                }
    
            #write the page
            path = os.path.join(__view__, 'home.html')
            self.response.out.write(template.render(path, template_values))

            
        

class Notebook(webapp.RequestHandler):
    def get(self):

        user = users.get_current_user()
            
        #if the user is logged
        if user:
            
            #search for notes
            notes = Note.all().filter('author =', user)
            
            #logout link
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'

            #values for templates
            template_values = {
               'user':user,
                'notes': notes,
                'url': url,
                'url_linktext': url_linktext,
                }
    
            #write the page
            path = os.path.join(__view__, 'notebook.html')
            self.response.out.write(template.render(path, template_values))

        #if isn't logged
        else:
            
            #url login
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'
            
            
            #values for templates
            template_values = {
                'url': url,
                'url_linktext': url_linktext,
                }
    
            #write the page
            path = os.path.join(__view__, 'home.html')
            self.response.out.write(template.render(path, template_values))


class SaveNote(webapp.RequestHandler):
    def post(self):
        
        
        user = users.get_current_user()
        if user:     
                    
            note_date= datetime.datetime.strptime(self.request.get('note_date'),"%Y-%m-%d").date() 
            note_title = self.request.get('note_title')
            note_body = self.request.get('note_body')
            
            
            note = Note.all().filter('author =', user).filter('date =', note_date).get()
    
            
            if not note:
                self.response.out.write("new note ")
                note = Note()
                note.author = user        
                note.date = note_date
            
            else:
                self.response.out.write("update note ")
            
            note.title = note_title
            note.body = note_body
            note.put()
            self.response.out.write("1")

        else:
            self.redirect(users.create_login_url(self.request.uri))

            
        
        
class Today(webapp.RequestHandler):
    def get(self):
        self.response.out.write("<script>var localTime = new Date(); window.location.href =  '/?date='+ localTime.getFullYear('yyyy')+'-'+(localTime.getMonth()+1)+'-'+localTime.getDate()</script>")            

class ModernBrowser(webapp.RequestHandler):
    def get(self):
        self.response.out.write('<p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>')            


#----------------------------------------configs--------------------------------------

application = webapp.WSGIApplication(
                                     [('/', MainPage),
                                      ('/notebook', Notebook),
                                      ('/savenote', SaveNote),
                                      ('/modernbrowser', ModernBrowser),
                                      ('/today', Today)],
                                     debug=True)


def main():
    run_wsgi_app(application)


if __name__ == "__main__":
    main()
    
