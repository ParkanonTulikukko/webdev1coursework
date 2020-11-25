/**
 * TODO: 8.3 List all users (use <template id="user-template"> in users.html)
 *       - Each user should be put inside a clone of the template fragment
 *       - Each individual user HTML should look like this
 *         (notice the id attributes and values, replace "{userId}" with the actual user id)
 *
 *         <div class="item-row" id="user-{userId}">
 *           <h3 class="user-name" id="name-{userId}">Admin</h3>
 *           <p class="user-email" id="email-{userId}">admin@email.com</p>
 *           <p class="user-role" id="role-{userId}">admin</p>
 *           <button class="modify-button" id="modify-{userId}">Modify</button>
 *           <button class="delete-button" id="delete-{userId}">Delete</button>
 *         </div>
 *
 *       - Each cloned template fragment should be appended to <div id="users-container">
 *       - Use getJSON() function from utils.js to fetch user data from server
 *
 * TODO: 8.5 Updating/modifying and deleting existing users
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 *       - Use deleteResource() function from utils.js to delete users from server
 *       - Clicking "Delete" button of a user will delete the user and update the listing accordingly
 *       - Clicking "Modify" button of a user will use <template id="form-template"> to
 *         show an editing form populated with the values of the selected user
 *       - The edit form should appear inside <div id="modify-user">
 *       - Afted successful edit of user the form should be removed and the listing updated accordingly
 *       - You can use removeElement() from utils.js to remove the form.
 *       - Remove edit form from the DOM after successful edit or replace it with a new form when another
 *         user's "Modify" button is clicked. There should never be more than one form visible at any time.
 *         (Notice that the edit form has an id "edit-user-form" which should be unique in the DOM at all times.)
 *       - Also remove the edit form when a user is deleted regardless of which user is deleted.
 *       - Modifying a user successfully should show a notification message "Updated user {User Name}"
 *       - Deleting a user successfully should show a notification message "Deleted user {User Name}"
 *       - Use createNotification() function from utils.js to create notifications
 */

//8.3

window.onload = async () => {
  const userdata = await getJSON('/api/users');
  // only enter the block if userdata was actually returned by the request.
  if (userdata) {
    const temp = document.getElementById('user-template');
    const userdiv = document.getElementById('users-container');
    userdata.map((user) => {
      let tmp = temp.content.cloneNode(true);
      tmp.querySelector('.item-row').setAttribute('id', 'user-' + user._id);

      let name = tmp.querySelector('.user-name');
      name.setAttribute('id', 'name-' + user._id);
      name.textContent = user.name;

      let email = tmp.querySelector('.user-email');
      email.setAttribute('id', 'email-' + user._id);
      email.textContent = user.email;

      let role = tmp.querySelector('.user-role');
      role.setAttribute('id', 'role-' + user._id);
      role.textContent = user.role;

      tmp.querySelector('.modify-button').setAttribute('id', 'modify-' + user._id);
      tmp.querySelector('.delete-button').setAttribute('id', 'delete-' + user._id);

      userdiv.append(tmp);

      // EventListener for each modify-button
      userdiv.querySelector('#modify-' + user._id).addEventListener("click", async () => {
        let ft = document.getElementById('form-template').content.cloneNode(true);
        let mu = document.getElementById('modify-user');
        if (document.getElementById('edit-user-form') !== null) {
          document.querySelector('#edit-user-form').remove();
        }
        let data = await getJSON('/api/users/' + user._id);
        let form = ft.querySelector('#edit-user-form');
        form["_id"].value = data._id;
        form['name'].value = data.name;
        form['email'].value = data.email;
        form['role'].value = data.role;
        ft.querySelector('.text-align-center').textContent = 'Modify user ' + data.name;
        mu.append(ft);
        // EventListener for update-button
        document.getElementById('update-button').addEventListener("click", (e) => {
          e.preventDefault();
          (async () => {
            data.role = form['role'].value;
            let moddeduser = await postOrPutJSON('/api/users/' + user._id, "PUT", data);
            createNotification('Updated user ' + moddeduser.name, 'notifications-container');
            document.querySelector('#user-' + user._id).querySelector('.user-role').textContent = data.role;
            document.querySelector('#edit-user-form').remove();
          })();
        });

      });

      // EventListener for each delete-button
      userdiv.querySelector('#delete-' + user._id).addEventListener("click", async () => {
        //console.log(user._id);
        let editf = document.querySelector('#edit-user-form');
        if (editf !== null) editf.remove();
        let asd = await deleteResourse('/api/users/' + user._id);
        createNotification('Deleted user ' + asd.name, 'notifications-container');
        document.getElementById('user-' + user._id).remove();
      });

    });
  }



}
