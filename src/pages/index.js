import React from "react";

import { withApollo } from "@lib/apollo";
import { PublicLayout } from "@templates/Layout";
import { Heading } from "@atoms/Heading";
import { withAuthProvider } from "@molecules/AuthProvider";

function Index() {
  return (
    <PublicLayout loading={false}>
      <Heading type="h4">Welcome to The Luupe interview app.</Heading>
      <p className="mt-3">
        This is a sandbox based on our actual app. Meaning, the structure, packages and principals of our app are all
        present in here.
      </p>
      <p>A couple of things to take into account:</p>

      <ul>
        <li>Our Frontend structure is based on atomic design: https://bradfrost.com/blog/post/atomic-web-design/</li>
        <ul>
          <li>Atoms: Base components</li>
          <li>Molecules: Components made of Atoms</li>
          <li>Organisms: Components made of Molecules and Atoms</li>
          <li>Templates: Components made of Organisms</li>
        </ul>
        <li>We added a fair amount of Icons so you should be covered on that regard :)</li>
        <li>We're expecting you to work with TypeScript on the Client and JavaScript on the Server</li>
        <li>
          We included a couple of files to help you out making the app (and also test how you would integrate with
          Components already existing in the App) like for example 'DeleteModal' and 'server/routers/auth.js'
        </li>
        <li>Our main tech stack is:</li>
        <ul>
          <li>JavaScript / TypeScript</li>
          <li>SQL</li>
          <li>Prisma</li>
          <li>Nexus</li>
          <li>Node.js</li>
          <li>GraphQL</li>
          <li>React</li>
          <li>Nextjs</li>
        </ul>
        <li>We're including two pages</li>
        <ul>
          <li>Index: With a summary of the activities</li>
          <li>Users: Where we currently manage all the info related to a user</li>
        </ul>
      </ul>

      <Heading variant="secondary">We wish you the best of lucks!!</Heading>

      <Heading className="mt-5">ACTIVITIES</Heading>
      <ul>
        <li>
          Update the `dev` NPM Script to allow us to run the App using nodemon (package already installed). `start`
          Script should remain as it is
        </li>
        <li>Add Post Feature</li>
        <ul>
          <li>Posts have an Author</li>
          <li>An Author can have multiple Posts</li>
          <li>We should be able to add, edit and delete Posts</li>
          <li>Add totalPosts per User on the User table</li>
          <li>Create a view to display all the Posts</li>
          <li>Create a view to display all the Posts for a User</li>
        </ul>
        <li>Allow users to edit their information</li>
        <li>Add Authentication (login, signup)</li>
        <ul>
          <li>Display the username on the Header</li>
        </ul>
        <li>Improve permissions</li>
        <ul>
          <li>Everyone can read the Posts (general Posts page)</li>
          <li>Only authenticated users can read the Posts per user</li>
          <li>Only the author can edit/delete their posts</li>
          <li>Only a User can edit their info</li>
        </ul>
        <li>Refresh the tables after adding/removing/modifying an entry</li>
      </ul>

      <Heading className="mt-3">NICE TO HAVE</Heading>
      <ul>
        <li>Solve the n+1 problem while fetching All the users will all their Posts</li>
        <li>Create prisma Seeds and a NPM Script to add them to our DB</li>
        <li>Paginate the tables</li>
      </ul>
    </PublicLayout>
  );
}

// eslint-disable-next-line import/no-default-export
export default withApollo(withAuthProvider(Index));
