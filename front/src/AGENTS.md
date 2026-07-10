# Front Source Guidance

The first two levels are fixed as `app`, `features`, and `shared`.
`app` composes routes and layouts; `features/<domain>` owns bounded product
behavior; `shared/<concern>` stays business-agnostic. Deeper folders are chosen
inside the owner as the PRD requires.
