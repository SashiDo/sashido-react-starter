// Cloud code for this starter: copy it into your SashiDo app's repository
// (cloud/main.js, or require it from there) and push to deploy.

// Every todo belongs to the user who created it: the ACL is set here, on the
// server, so a client can't create todos others can read or change.
Parse.Cloud.beforeSave('Todo', (request) => {
  const { object, user, master } = request;
  if (!user && !master) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'Log in to save todos.');
  }
  const title = object.get('title');
  if (typeof title !== 'string' || !title.trim() || title.length > 200) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'A todo needs a title of up to 200 characters.');
  }
  if (!object.existed() && user) {
    object.set('owner', user);
    object.setACL(new Parse.ACL(user));
  }
  // created with the master key (e.g. a script) and no ACL: nobody but the
  // master key, instead of Parse's default of public
  if (!object.existed() && !user && !object.getACL()) {
    object.setACL(new Parse.ACL());
  }
  if (object.existed() && object.dirty('owner')) {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, "A todo's owner can't change.");
  }
});
