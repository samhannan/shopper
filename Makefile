deploy:
	npm run build && \
	export AWS_PROFILE=personal && \
	cd public && aws s3 sync . s3://scrantime.com --acl=public-read && \
	aws cloudfront create-invalidation --distribution-id E2TD9FSBCCR6D1 --paths "/*" > /dev/null