This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with Typescript & Ant Design v5

First, install all packages

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Build
```bash
yarn build
```
	The project path:

-	src/pages -> define the route. This is a [Dynamic Route](https://nextjs.org/docs/routing/dynamic-routes) of NextJS.
Example: src/pages/invoices -> [host]/invoices (The invoices page)

-	src/components -> defines components used throughout the app

-	src/lib -> define HOCs, service, utils…

	In this project, I created an auth HOC to protect app’s route. The user needs to login to see a page. In the feature, we can upgrade it by using the [Next-auth](https://next-auth.js.org/), which is a powerful HOC for authentication with [NextJS Authentication Pattern](https://nextjs.org/docs/authentication)

	I used [Private API Route](https://nextjs.org/docs/api-routes/introduction) to protect app’s API. So, the API flow will be:
user click button or load page -> request API -> Private API -> API (the BE API)
In this way we can control the request API before it calls, and also, we can improve performance, hide a API call in network tab.
The Private API define in src/api/….

	I activated the [SSR](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) when fetching first data on page to improve performance.

	I used [Ant Design v5](https://ant.design/components/overview) to create a UI component.

	I used [SCSS](https://nextjs.org/docs/basic-features/built-in-css-support) that supported in NextJS

	I used Image of Antd, but in the feature, we can change it to [next/image](https://nextjs.org/docs/api-reference/next/image), and load it with CDN to improve performance.

