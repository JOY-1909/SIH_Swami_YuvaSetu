
```
Yuva-setu
├─ .env
├─ .vite
│  └─ deps
│     ├─ package.json
│     └─ _metadata.json
├─ backend
│  ├─ .env
│  ├─ app
│  │  ├─ api
│  │  │  ├─ deps.py
│  │  │  ├─ v1
│  │  │  │  ├─ auth.py
│  │  │  │  ├─ profile.py
│  │  │  │  ├─ resume.py
│  │  │  │  └─ __init__.py
│  │  │  └─ __init__
│  │  ├─ config.py
│  │  ├─ database.py
│  │  ├─ firebase_config.py
│  │  ├─ main.py
│  │  ├─ models
│  │  │  ├─ otp.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ schemas
│  │  │  ├─ auth.py
│  │  │  ├─ totp.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ services
│  │  │  ├─ email.py
│  │  │  ├─ google_auth.py
│  │  │  ├─ otp.py
│  │  │  ├─ sms.py
│  │  │  ├─ totp.py
│  │  │  └─ __init__.py
│  │  ├─ utils
│  │  │  ├─ pdf_generator.py
│  │  │  ├─ security.py
│  │  │  └─ __init__.py
│  │  └─ __init__.py
│  ├─ firebase-adminsdk.json
│  ├─ requirements.txt
│  └─ venv
│     ├─ Lib
│     │  └─ site-packages
│     │     ├─ aiohappyeyeballs
│     │     │  ├─ impl.py
│     │     │  ├─ py.typed
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ _staggered.py
│     │     │  └─ __init__.py
│     │     ├─ aiohttp
│     │     │  ├─ .hash
│     │     │  │  ├─ hdrs.py.hash
│     │     │  │  ├─ _cparser.pxd.hash
│     │     │  │  ├─ _find_header.pxd.hash
│     │     │  │  ├─ _http_parser.pyx.hash
│     │     │  │  └─ _http_writer.pyx.hash
│     │     │  ├─ abc.py
│     │     │  ├─ base_protocol.py
│     │     │  ├─ client.py
│     │     │  ├─ client_exceptions.py
│     │     │  ├─ client_middlewares.py
│     │     │  ├─ client_middleware_digest_auth.py
│     │     │  ├─ client_proto.py
│     │     │  ├─ client_reqrep.py
│     │     │  ├─ client_ws.py
│     │     │  ├─ compression_utils.py
│     │     │  ├─ connector.py
│     │     │  ├─ cookiejar.py
│     │     │  ├─ formdata.py
│     │     │  ├─ hdrs.py
│     │     │  ├─ helpers.py
│     │     │  ├─ http.py
│     │     │  ├─ http_exceptions.py
│     │     │  ├─ http_parser.py
│     │     │  ├─ http_websocket.py
│     │     │  ├─ http_writer.py
│     │     │  ├─ log.py
│     │     │  ├─ multipart.py
│     │     │  ├─ payload.py
│     │     │  ├─ payload_streamer.py
│     │     │  ├─ py.typed
│     │     │  ├─ pytest_plugin.py
│     │     │  ├─ resolver.py
│     │     │  ├─ streams.py
│     │     │  ├─ tcp_helpers.py
│     │     │  ├─ test_utils.py
│     │     │  ├─ tracing.py
│     │     │  ├─ typedefs.py
│     │     │  ├─ web.py
│     │     │  ├─ web_app.py
│     │     │  ├─ web_exceptions.py
│     │     │  ├─ web_fileresponse.py
│     │     │  ├─ web_log.py
│     │     │  ├─ web_middlewares.py
│     │     │  ├─ web_protocol.py
│     │     │  ├─ web_request.py
│     │     │  ├─ web_response.py
│     │     │  ├─ web_routedef.py
│     │     │  ├─ web_runner.py
│     │     │  ├─ web_server.py
│     │     │  ├─ web_urldispatcher.py
│     │     │  ├─ web_ws.py
│     │     │  ├─ worker.py
│     │     │  ├─ _cookie_helpers.py
│     │     │  ├─ _cparser.pxd
│     │     │  ├─ _find_header.pxd
│     │     │  ├─ _headers.pxi
│     │     │  ├─ _http_parser.cp312-win_amd64.pyd
│     │     │  ├─ _http_parser.pyx
│     │     │  ├─ _http_writer.cp312-win_amd64.pyd
│     │     │  ├─ _http_writer.pyx
│     │     │  ├─ _websocket
│     │     │  │  ├─ .hash
│     │     │  │  │  ├─ mask.pxd.hash
│     │     │  │  │  ├─ mask.pyx.hash
│     │     │  │  │  └─ reader_c.pxd.hash
│     │     │  │  ├─ helpers.py
│     │     │  │  ├─ mask.cp312-win_amd64.pyd
│     │     │  │  ├─ mask.pxd
│     │     │  │  ├─ mask.pyx
│     │     │  │  ├─ models.py
│     │     │  │  ├─ reader.py
│     │     │  │  ├─ reader_c.cp312-win_amd64.pyd
│     │     │  │  ├─ reader_c.pxd
│     │     │  │  ├─ reader_c.py
│     │     │  │  ├─ reader_py.py
│     │     │  │  ├─ writer.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ aiohttp_retry
│     │     │  ├─ client.py
│     │     │  ├─ py.typed
│     │     │  ├─ retry_options.py
│     │     │  ├─ types.py
│     │     │  └─ __init__.py
│     │     ├─ aiosignal
│     │     │  ├─ py.typed
│     │     │  └─ __init__.py
│     │     ├─ aiosmtplib
│     │     │  ├─ api.py
│     │     │  ├─ auth.py
│     │     │  ├─ email.py
│     │     │  ├─ errors.py
│     │     │  ├─ esmtp.py
│     │     │  ├─ protocol.py
│     │     │  ├─ py.typed
│     │     │  ├─ response.py
│     │     │  ├─ smtp.py
│     │     │  ├─ status.py
│     │     │  ├─ typing.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ annotated_types
│     │     │  ├─ py.typed
│     │     │  ├─ test_cases.py
│     │     │  └─ __init__.py
│     │     ├─ anyio
│     │     │  ├─ abc
│     │     │  │  ├─ _resources.py
│     │     │  │  ├─ _sockets.py
│     │     │  │  ├─ _streams.py
│     │     │  │  ├─ _subprocesses.py
│     │     │  │  ├─ _tasks.py
│     │     │  │  ├─ _testing.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ from_thread.py
│     │     │  ├─ lowlevel.py
│     │     │  ├─ py.typed
│     │     │  ├─ pytest_plugin.py
│     │     │  ├─ streams
│     │     │  │  ├─ buffered.py
│     │     │  │  ├─ file.py
│     │     │  │  ├─ memory.py
│     │     │  │  ├─ stapled.py
│     │     │  │  ├─ text.py
│     │     │  │  ├─ tls.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ to_process.py
│     │     │  ├─ to_thread.py
│     │     │  ├─ _backends
│     │     │  │  ├─ _asyncio.py
│     │     │  │  ├─ _trio.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _core
│     │     │  │  ├─ _compat.py
│     │     │  │  ├─ _eventloop.py
│     │     │  │  ├─ _exceptions.py
│     │     │  │  ├─ _fileio.py
│     │     │  │  ├─ _resources.py
│     │     │  │  ├─ _signals.py
│     │     │  │  ├─ _sockets.py
│     │     │  │  ├─ _streams.py
│     │     │  │  ├─ _subprocesses.py
│     │     │  │  ├─ _synchronization.py
│     │     │  │  ├─ _tasks.py
│     │     │  │  ├─ _testing.py
│     │     │  │  ├─ _typedattr.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ apiclient
│     │     │  └─ __init__.py
│     │     ├─ argon2
│     │     │  ├─ exceptions.py
│     │     │  ├─ low_level.py
│     │     │  ├─ profiles.py
│     │     │  ├─ py.typed
│     │     │  ├─ _legacy.py
│     │     │  ├─ _password_hasher.py
│     │     │  ├─ _typing.py
│     │     │  ├─ _utils.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ attr
│     │     │  ├─ converters.py
│     │     │  ├─ converters.pyi
│     │     │  ├─ exceptions.py
│     │     │  ├─ exceptions.pyi
│     │     │  ├─ filters.py
│     │     │  ├─ filters.pyi
│     │     │  ├─ py.typed
│     │     │  ├─ setters.py
│     │     │  ├─ setters.pyi
│     │     │  ├─ validators.py
│     │     │  ├─ validators.pyi
│     │     │  ├─ _cmp.py
│     │     │  ├─ _cmp.pyi
│     │     │  ├─ _compat.py
│     │     │  ├─ _config.py
│     │     │  ├─ _funcs.py
│     │     │  ├─ _make.py
│     │     │  ├─ _next_gen.py
│     │     │  ├─ _typing_compat.pyi
│     │     │  ├─ _version_info.py
│     │     │  ├─ _version_info.pyi
│     │     │  ├─ __init__.py
│     │     │  └─ __init__.pyi
│     │     ├─ attrs
│     │     │  ├─ converters.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ filters.py
│     │     │  ├─ py.typed
│     │     │  ├─ setters.py
│     │     │  ├─ validators.py
│     │     │  ├─ __init__.py
│     │     │  └─ __init__.pyi
│     │     ├─ authlib
│     │     │  ├─ common
│     │     │  │  ├─ encoding.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ security.py
│     │     │  │  ├─ urls.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ consts.py
│     │     │  ├─ deprecate.py
│     │     │  ├─ integrations
│     │     │  │  ├─ base_client
│     │     │  │  │  ├─ async_app.py
│     │     │  │  │  ├─ async_openid.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ framework_integration.py
│     │     │  │  │  ├─ registry.py
│     │     │  │  │  ├─ sync_app.py
│     │     │  │  │  ├─ sync_openid.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ django_client
│     │     │  │  │  ├─ apps.py
│     │     │  │  │  ├─ integration.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ django_oauth1
│     │     │  │  │  ├─ authorization_server.py
│     │     │  │  │  ├─ nonce.py
│     │     │  │  │  ├─ resource_protector.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ django_oauth2
│     │     │  │  │  ├─ authorization_server.py
│     │     │  │  │  ├─ endpoints.py
│     │     │  │  │  ├─ requests.py
│     │     │  │  │  ├─ resource_protector.py
│     │     │  │  │  ├─ signals.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ flask_client
│     │     │  │  │  ├─ apps.py
│     │     │  │  │  ├─ integration.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ flask_oauth1
│     │     │  │  │  ├─ authorization_server.py
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ resource_protector.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ flask_oauth2
│     │     │  │  │  ├─ authorization_server.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ requests.py
│     │     │  │  │  ├─ resource_protector.py
│     │     │  │  │  ├─ signals.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ httpx_client
│     │     │  │  │  ├─ assertion_client.py
│     │     │  │  │  ├─ oauth1_client.py
│     │     │  │  │  ├─ oauth2_client.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ requests_client
│     │     │  │  │  ├─ assertion_session.py
│     │     │  │  │  ├─ oauth1_session.py
│     │     │  │  │  ├─ oauth2_session.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ sqla_oauth2
│     │     │  │  │  ├─ client_mixin.py
│     │     │  │  │  ├─ functions.py
│     │     │  │  │  ├─ tokens_mixins.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ starlette_client
│     │     │  │  │  ├─ apps.py
│     │     │  │  │  ├─ integration.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ jose
│     │     │  │  ├─ drafts
│     │     │  │  │  ├─ _jwe_algorithms.py
│     │     │  │  │  ├─ _jwe_enc_cryptodome.py
│     │     │  │  │  ├─ _jwe_enc_cryptography.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ jwk.py
│     │     │  │  ├─ rfc7515
│     │     │  │  │  ├─ jws.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7516
│     │     │  │  │  ├─ jwe.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7517
│     │     │  │  │  ├─ asymmetric_key.py
│     │     │  │  │  ├─ base_key.py
│     │     │  │  │  ├─ jwk.py
│     │     │  │  │  ├─ key_set.py
│     │     │  │  │  ├─ _cryptography_key.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7518
│     │     │  │  │  ├─ ec_key.py
│     │     │  │  │  ├─ jwe_algs.py
│     │     │  │  │  ├─ jwe_encs.py
│     │     │  │  │  ├─ jwe_zips.py
│     │     │  │  │  ├─ jws_algs.py
│     │     │  │  │  ├─ oct_key.py
│     │     │  │  │  ├─ rsa_key.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7519
│     │     │  │  │  ├─ claims.py
│     │     │  │  │  ├─ jwt.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc8037
│     │     │  │  │  ├─ jws_eddsa.py
│     │     │  │  │  ├─ okp_key.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ util.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ oauth1
│     │     │  │  ├─ client.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ rfc5849
│     │     │  │  │  ├─ authorization_server.py
│     │     │  │  │  ├─ base_server.py
│     │     │  │  │  ├─ client_auth.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ parameters.py
│     │     │  │  │  ├─ resource_protector.py
│     │     │  │  │  ├─ rsa.py
│     │     │  │  │  ├─ signature.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  ├─ wrapper.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ oauth2
│     │     │  │  ├─ auth.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ rfc6749
│     │     │  │  │  ├─ authenticate_client.py
│     │     │  │  │  ├─ authorization_server.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ grants
│     │     │  │  │  │  ├─ authorization_code.py
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ client_credentials.py
│     │     │  │  │  │  ├─ implicit.py
│     │     │  │  │  │  ├─ refresh_token.py
│     │     │  │  │  │  ├─ resource_owner_password_credentials.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ parameters.py
│     │     │  │  │  ├─ requests.py
│     │     │  │  │  ├─ resource_protector.py
│     │     │  │  │  ├─ token_endpoint.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  ├─ wrappers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc6750
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ parameters.py
│     │     │  │  │  ├─ token.py
│     │     │  │  │  ├─ validator.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7009
│     │     │  │  │  ├─ parameters.py
│     │     │  │  │  ├─ revocation.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7521
│     │     │  │  │  ├─ client.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7523
│     │     │  │  │  ├─ assertion.py
│     │     │  │  │  ├─ auth.py
│     │     │  │  │  ├─ client.py
│     │     │  │  │  ├─ jwt_bearer.py
│     │     │  │  │  ├─ token.py
│     │     │  │  │  ├─ validator.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7591
│     │     │  │  │  ├─ claims.py
│     │     │  │  │  ├─ endpoint.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7592
│     │     │  │  │  ├─ endpoint.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7636
│     │     │  │  │  ├─ challenge.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc7662
│     │     │  │  │  ├─ introspection.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ token_validator.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc8414
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ well_known.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc8628
│     │     │  │  │  ├─ device_code.py
│     │     │  │  │  ├─ endpoint.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc8693
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc9068
│     │     │  │  │  ├─ claims.py
│     │     │  │  │  ├─ introspection.py
│     │     │  │  │  ├─ revocation.py
│     │     │  │  │  ├─ token.py
│     │     │  │  │  ├─ token_validator.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ oidc
│     │     │  │  ├─ core
│     │     │  │  │  ├─ claims.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ grants
│     │     │  │  │  │  ├─ code.py
│     │     │  │  │  │  ├─ hybrid.py
│     │     │  │  │  │  ├─ implicit.py
│     │     │  │  │  │  ├─ util.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ discovery
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ well_known.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ bcrypt
│     │     │  ├─ py.typed
│     │     │  ├─ _bcrypt.pyd
│     │     │  ├─ __init__.py
│     │     │  └─ __init__.pyi
│     │     ├─ beanie
│     │     │  ├─ exceptions.py
│     │     │  ├─ executors
│     │     │  │  ├─ migrate.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ migrations
│     │     │  │  ├─ controllers
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ free_fall.py
│     │     │  │  │  ├─ iterative.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ database.py
│     │     │  │  ├─ models.py
│     │     │  │  ├─ runner.py
│     │     │  │  ├─ template.py
│     │     │  │  ├─ utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ odm
│     │     │  │  ├─ actions.py
│     │     │  │  ├─ bulk.py
│     │     │  │  ├─ cache.py
│     │     │  │  ├─ custom_types
│     │     │  │  │  ├─ bson
│     │     │  │  │  │  ├─ binary.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ decimal.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ documents.py
│     │     │  │  ├─ enums.py
│     │     │  │  ├─ fields.py
│     │     │  │  ├─ interfaces
│     │     │  │  │  ├─ aggregate.py
│     │     │  │  │  ├─ aggregation_methods.py
│     │     │  │  │  ├─ clone.py
│     │     │  │  │  ├─ detector.py
│     │     │  │  │  ├─ find.py
│     │     │  │  │  ├─ getters.py
│     │     │  │  │  ├─ inheritance.py
│     │     │  │  │  ├─ session.py
│     │     │  │  │  ├─ setters.py
│     │     │  │  │  ├─ update.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ models.py
│     │     │  │  ├─ operators
│     │     │  │  │  ├─ find
│     │     │  │  │  │  ├─ array.py
│     │     │  │  │  │  ├─ bitwise.py
│     │     │  │  │  │  ├─ comparison.py
│     │     │  │  │  │  ├─ element.py
│     │     │  │  │  │  ├─ evaluation.py
│     │     │  │  │  │  ├─ geospatial.py
│     │     │  │  │  │  ├─ logical.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ update
│     │     │  │  │  │  ├─ array.py
│     │     │  │  │  │  ├─ bitwise.py
│     │     │  │  │  │  ├─ general.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ queries
│     │     │  │  │  ├─ aggregation.py
│     │     │  │  │  ├─ cursor.py
│     │     │  │  │  ├─ delete.py
│     │     │  │  │  ├─ find.py
│     │     │  │  │  ├─ update.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ registry.py
│     │     │  │  ├─ settings
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ document.py
│     │     │  │  │  ├─ timeseries.py
│     │     │  │  │  ├─ union_doc.py
│     │     │  │  │  ├─ view.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ union_doc.py
│     │     │  │  ├─ utils
│     │     │  │  │  ├─ dump.py
│     │     │  │  │  ├─ encoder.py
│     │     │  │  │  ├─ find.py
│     │     │  │  │  ├─ general.py
│     │     │  │  │  ├─ init.py
│     │     │  │  │  ├─ parsing.py
│     │     │  │  │  ├─ projection.py
│     │     │  │  │  ├─ pydantic.py
│     │     │  │  │  ├─ relations.py
│     │     │  │  │  ├─ self_validation.py
│     │     │  │  │  ├─ state.py
│     │     │  │  │  ├─ typing.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ views.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ operators.py
│     │     │  ├─ py.typed
│     │     │  ├─ pydantic_check.py
│     │     │  └─ __init__.py
│     │     ├─ bs4
│     │     │  ├─ builder
│     │     │  │  ├─ _html5lib.py
│     │     │  │  ├─ _htmlparser.py
│     │     │  │  ├─ _lxml.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ css.py
│     │     │  ├─ dammit.py
│     │     │  ├─ diagnose.py
│     │     │  ├─ element.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ filter.py
│     │     │  ├─ formatter.py
│     │     │  ├─ py.typed
│     │     │  ├─ _deprecation.py
│     │     │  ├─ _typing.py
│     │     │  ├─ _warnings.py
│     │     │  └─ __init__.py
│     │     ├─ bson
│     │     │  ├─ binary.py
│     │     │  ├─ bson-endian.h
│     │     │  ├─ buffer.c
│     │     │  ├─ buffer.h
│     │     │  ├─ code.py
│     │     │  ├─ codec_options.py
│     │     │  ├─ datetime_ms.py
│     │     │  ├─ dbref.py
│     │     │  ├─ decimal128.py
│     │     │  ├─ errors.py
│     │     │  ├─ int64.py
│     │     │  ├─ json_util.py
│     │     │  ├─ max_key.py
│     │     │  ├─ min_key.py
│     │     │  ├─ objectid.py
│     │     │  ├─ py.typed
│     │     │  ├─ raw_bson.py
│     │     │  ├─ regex.py
│     │     │  ├─ son.py
│     │     │  ├─ time64.c
│     │     │  ├─ time64.h
│     │     │  ├─ time64_config.h
│     │     │  ├─ time64_limits.h
│     │     │  ├─ timestamp.py
│     │     │  ├─ typings.py
│     │     │  ├─ tz_util.py
│     │     │  ├─ _cbson.cp312-win_amd64.pyd
│     │     │  ├─ _cbsonmodule.c
│     │     │  ├─ _cbsonmodule.h
│     │     │  ├─ _helpers.py
│     │     │  └─ __init__.py
│     │     ├─ cachecontrol
│     │     │  ├─ adapter.py
│     │     │  ├─ cache.py
│     │     │  ├─ caches
│     │     │  │  ├─ file_cache.py
│     │     │  │  ├─ redis_cache.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ controller.py
│     │     │  ├─ filewrapper.py
│     │     │  ├─ heuristics.py
│     │     │  ├─ py.typed
│     │     │  ├─ serialize.py
│     │     │  ├─ wrapper.py
│     │     │  ├─ _cmd.py
│     │     │  └─ __init__.py
│     │     ├─ cachetools
│     │     │  ├─ func.py
│     │     │  ├─ keys.py
│     │     │  ├─ _decorators.py
│     │     │  └─ __init__.py
│     │     ├─ certifi
│     │     │  ├─ cacert.pem
│     │     │  ├─ core.py
│     │     │  ├─ py.typed
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ cffi
│     │     │  ├─ api.py
│     │     │  ├─ backend_ctypes.py
│     │     │  ├─ cffi_opcode.py
│     │     │  ├─ commontypes.py
│     │     │  ├─ cparser.py
│     │     │  ├─ error.py
│     │     │  ├─ ffiplatform.py
│     │     │  ├─ lock.py
│     │     │  ├─ model.py
│     │     │  ├─ parse_c_type.h
│     │     │  ├─ pkgconfig.py
│     │     │  ├─ recompiler.py
│     │     │  ├─ setuptools_ext.py
│     │     │  ├─ vengine_cpy.py
│     │     │  ├─ vengine_gen.py
│     │     │  ├─ verifier.py
│     │     │  ├─ _cffi_errors.h
│     │     │  ├─ _cffi_include.h
│     │     │  ├─ _embedding.h
│     │     │  ├─ _imp_emulation.py
│     │     │  └─ __init__.py
│     │     ├─ charset_normalizer
│     │     │  ├─ api.py
│     │     │  ├─ cd.py
│     │     │  ├─ cli
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ constant.py
│     │     │  ├─ legacy.py
│     │     │  ├─ md.cp312-win_amd64.pyd
│     │     │  ├─ md.py
│     │     │  ├─ md__mypyc.cp312-win_amd64.pyd
│     │     │  ├─ models.py
│     │     │  ├─ py.typed
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ click
│     │     │  ├─ core.py
│     │     │  ├─ decorators.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ formatting.py
│     │     │  ├─ globals.py
│     │     │  ├─ parser.py
│     │     │  ├─ py.typed
│     │     │  ├─ shell_completion.py
│     │     │  ├─ termui.py
│     │     │  ├─ testing.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _termui_impl.py
│     │     │  ├─ _textwrap.py
│     │     │  ├─ _utils.py
│     │     │  ├─ _winconsole.py
│     │     │  └─ __init__.py
│     │     ├─ colorama
│     │     │  ├─ ansi.py
│     │     │  ├─ ansitowin32.py
│     │     │  ├─ initialise.py
│     │     │  ├─ tests
│     │     │  │  ├─ ansitowin32_test.py
│     │     │  │  ├─ ansi_test.py
│     │     │  │  ├─ initialise_test.py
│     │     │  │  ├─ isatty_test.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ winterm_test.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ win32.py
│     │     │  ├─ winterm.py
│     │     │  └─ __init__.py
│     │     ├─ cryptography
│     │     │  ├─ exceptions.py
│     │     │  ├─ fernet.py
│     │     │  ├─ hazmat
│     │     │  │  ├─ asn1
│     │     │  │  │  ├─ asn1.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ backends
│     │     │  │  │  ├─ openssl
│     │     │  │  │  │  ├─ backend.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ bindings
│     │     │  │  │  ├─ openssl
│     │     │  │  │  │  ├─ binding.py
│     │     │  │  │  │  ├─ _conditional.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ _rust
│     │     │  │  │  │  ├─ asn1.pyi
│     │     │  │  │  │  ├─ declarative_asn1.pyi
│     │     │  │  │  │  ├─ exceptions.pyi
│     │     │  │  │  │  ├─ ocsp.pyi
│     │     │  │  │  │  ├─ openssl
│     │     │  │  │  │  │  ├─ aead.pyi
│     │     │  │  │  │  │  ├─ ciphers.pyi
│     │     │  │  │  │  │  ├─ cmac.pyi
│     │     │  │  │  │  │  ├─ dh.pyi
│     │     │  │  │  │  │  ├─ dsa.pyi
│     │     │  │  │  │  │  ├─ ec.pyi
│     │     │  │  │  │  │  ├─ ed25519.pyi
│     │     │  │  │  │  │  ├─ ed448.pyi
│     │     │  │  │  │  │  ├─ hashes.pyi
│     │     │  │  │  │  │  ├─ hmac.pyi
│     │     │  │  │  │  │  ├─ kdf.pyi
│     │     │  │  │  │  │  ├─ keys.pyi
│     │     │  │  │  │  │  ├─ poly1305.pyi
│     │     │  │  │  │  │  ├─ rsa.pyi
│     │     │  │  │  │  │  ├─ x25519.pyi
│     │     │  │  │  │  │  ├─ x448.pyi
│     │     │  │  │  │  │  └─ __init__.pyi
│     │     │  │  │  │  ├─ pkcs12.pyi
│     │     │  │  │  │  ├─ pkcs7.pyi
│     │     │  │  │  │  ├─ test_support.pyi
│     │     │  │  │  │  ├─ x509.pyi
│     │     │  │  │  │  ├─ _openssl.pyi
│     │     │  │  │  │  └─ __init__.pyi
│     │     │  │  │  ├─ _rust.pyd
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ decrepit
│     │     │  │  │  ├─ ciphers
│     │     │  │  │  │  ├─ algorithms.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ primitives
│     │     │  │  │  ├─ asymmetric
│     │     │  │  │  │  ├─ dh.py
│     │     │  │  │  │  ├─ dsa.py
│     │     │  │  │  │  ├─ ec.py
│     │     │  │  │  │  ├─ ed25519.py
│     │     │  │  │  │  ├─ ed448.py
│     │     │  │  │  │  ├─ padding.py
│     │     │  │  │  │  ├─ rsa.py
│     │     │  │  │  │  ├─ types.py
│     │     │  │  │  │  ├─ utils.py
│     │     │  │  │  │  ├─ x25519.py
│     │     │  │  │  │  ├─ x448.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ ciphers
│     │     │  │  │  │  ├─ aead.py
│     │     │  │  │  │  ├─ algorithms.py
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ modes.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ cmac.py
│     │     │  │  │  ├─ constant_time.py
│     │     │  │  │  ├─ hashes.py
│     │     │  │  │  ├─ hmac.py
│     │     │  │  │  ├─ kdf
│     │     │  │  │  │  ├─ argon2.py
│     │     │  │  │  │  ├─ concatkdf.py
│     │     │  │  │  │  ├─ hkdf.py
│     │     │  │  │  │  ├─ kbkdf.py
│     │     │  │  │  │  ├─ pbkdf2.py
│     │     │  │  │  │  ├─ scrypt.py
│     │     │  │  │  │  ├─ x963kdf.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ keywrap.py
│     │     │  │  │  ├─ padding.py
│     │     │  │  │  ├─ poly1305.py
│     │     │  │  │  ├─ serialization
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ pkcs12.py
│     │     │  │  │  │  ├─ pkcs7.py
│     │     │  │  │  │  ├─ ssh.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ twofactor
│     │     │  │  │  │  ├─ hotp.py
│     │     │  │  │  │  ├─ totp.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ _asymmetric.py
│     │     │  │  │  ├─ _cipheralgorithm.py
│     │     │  │  │  ├─ _serialization.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ _oid.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ py.typed
│     │     │  ├─ utils.py
│     │     │  ├─ x509
│     │     │  │  ├─ base.py
│     │     │  │  ├─ certificate_transparency.py
│     │     │  │  ├─ extensions.py
│     │     │  │  ├─ general_name.py
│     │     │  │  ├─ name.py
│     │     │  │  ├─ ocsp.py
│     │     │  │  ├─ oid.py
│     │     │  │  ├─ verification.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ __about__.py
│     │     │  └─ __init__.py
│     │     ├─ dateutil
│     │     │  ├─ easter.py
│     │     │  ├─ parser
│     │     │  │  ├─ isoparser.py
│     │     │  │  ├─ _parser.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ relativedelta.py
│     │     │  ├─ rrule.py
│     │     │  ├─ tz
│     │     │  │  ├─ tz.py
│     │     │  │  ├─ win.py
│     │     │  │  ├─ _common.py
│     │     │  │  ├─ _factories.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ tzwin.py
│     │     │  ├─ utils.py
│     │     │  ├─ zoneinfo
│     │     │  │  ├─ dateutil-zoneinfo.tar.gz
│     │     │  │  ├─ rebuild.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _common.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ defusedxml
│     │     │  ├─ cElementTree.py
│     │     │  ├─ common.py
│     │     │  ├─ ElementTree.py
│     │     │  ├─ expatbuilder.py
│     │     │  ├─ expatreader.py
│     │     │  ├─ lxml.py
│     │     │  ├─ minidom.py
│     │     │  ├─ pulldom.py
│     │     │  ├─ sax.py
│     │     │  ├─ xmlrpc.py
│     │     │  └─ __init__.py
│     │     ├─ dns
│     │     │  ├─ asyncbackend.py
│     │     │  ├─ asyncquery.py
│     │     │  ├─ asyncresolver.py
│     │     │  ├─ btree.py
│     │     │  ├─ btreezone.py
│     │     │  ├─ dnssec.py
│     │     │  ├─ dnssecalgs
│     │     │  │  ├─ base.py
│     │     │  │  ├─ cryptography.py
│     │     │  │  ├─ dsa.py
│     │     │  │  ├─ ecdsa.py
│     │     │  │  ├─ eddsa.py
│     │     │  │  ├─ rsa.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ dnssectypes.py
│     │     │  ├─ e164.py
│     │     │  ├─ edns.py
│     │     │  ├─ entropy.py
│     │     │  ├─ enum.py
│     │     │  ├─ exception.py
│     │     │  ├─ flags.py
│     │     │  ├─ grange.py
│     │     │  ├─ immutable.py
│     │     │  ├─ inet.py
│     │     │  ├─ ipv4.py
│     │     │  ├─ ipv6.py
│     │     │  ├─ message.py
│     │     │  ├─ name.py
│     │     │  ├─ namedict.py
│     │     │  ├─ nameserver.py
│     │     │  ├─ node.py
│     │     │  ├─ opcode.py
│     │     │  ├─ py.typed
│     │     │  ├─ query.py
│     │     │  ├─ quic
│     │     │  │  ├─ _asyncio.py
│     │     │  │  ├─ _common.py
│     │     │  │  ├─ _sync.py
│     │     │  │  ├─ _trio.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ rcode.py
│     │     │  ├─ rdata.py
│     │     │  ├─ rdataclass.py
│     │     │  ├─ rdataset.py
│     │     │  ├─ rdatatype.py
│     │     │  ├─ rdtypes
│     │     │  │  ├─ ANY
│     │     │  │  │  ├─ AFSDB.py
│     │     │  │  │  ├─ AMTRELAY.py
│     │     │  │  │  ├─ AVC.py
│     │     │  │  │  ├─ CAA.py
│     │     │  │  │  ├─ CDNSKEY.py
│     │     │  │  │  ├─ CDS.py
│     │     │  │  │  ├─ CERT.py
│     │     │  │  │  ├─ CNAME.py
│     │     │  │  │  ├─ CSYNC.py
│     │     │  │  │  ├─ DLV.py
│     │     │  │  │  ├─ DNAME.py
│     │     │  │  │  ├─ DNSKEY.py
│     │     │  │  │  ├─ DS.py
│     │     │  │  │  ├─ DSYNC.py
│     │     │  │  │  ├─ EUI48.py
│     │     │  │  │  ├─ EUI64.py
│     │     │  │  │  ├─ GPOS.py
│     │     │  │  │  ├─ HINFO.py
│     │     │  │  │  ├─ HIP.py
│     │     │  │  │  ├─ ISDN.py
│     │     │  │  │  ├─ L32.py
│     │     │  │  │  ├─ L64.py
│     │     │  │  │  ├─ LOC.py
│     │     │  │  │  ├─ LP.py
│     │     │  │  │  ├─ MX.py
│     │     │  │  │  ├─ NID.py
│     │     │  │  │  ├─ NINFO.py
│     │     │  │  │  ├─ NS.py
│     │     │  │  │  ├─ NSEC.py
│     │     │  │  │  ├─ NSEC3.py
│     │     │  │  │  ├─ NSEC3PARAM.py
│     │     │  │  │  ├─ OPENPGPKEY.py
│     │     │  │  │  ├─ OPT.py
│     │     │  │  │  ├─ PTR.py
│     │     │  │  │  ├─ RESINFO.py
│     │     │  │  │  ├─ RP.py
│     │     │  │  │  ├─ RRSIG.py
│     │     │  │  │  ├─ RT.py
│     │     │  │  │  ├─ SMIMEA.py
│     │     │  │  │  ├─ SOA.py
│     │     │  │  │  ├─ SPF.py
│     │     │  │  │  ├─ SSHFP.py
│     │     │  │  │  ├─ TKEY.py
│     │     │  │  │  ├─ TLSA.py
│     │     │  │  │  ├─ TSIG.py
│     │     │  │  │  ├─ TXT.py
│     │     │  │  │  ├─ URI.py
│     │     │  │  │  ├─ WALLET.py
│     │     │  │  │  ├─ X25.py
│     │     │  │  │  ├─ ZONEMD.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ CH
│     │     │  │  │  ├─ A.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ dnskeybase.py
│     │     │  │  ├─ dsbase.py
│     │     │  │  ├─ euibase.py
│     │     │  │  ├─ IN
│     │     │  │  │  ├─ A.py
│     │     │  │  │  ├─ AAAA.py
│     │     │  │  │  ├─ APL.py
│     │     │  │  │  ├─ DHCID.py
│     │     │  │  │  ├─ HTTPS.py
│     │     │  │  │  ├─ IPSECKEY.py
│     │     │  │  │  ├─ KX.py
│     │     │  │  │  ├─ NAPTR.py
│     │     │  │  │  ├─ NSAP.py
│     │     │  │  │  ├─ NSAP_PTR.py
│     │     │  │  │  ├─ PX.py
│     │     │  │  │  ├─ SRV.py
│     │     │  │  │  ├─ SVCB.py
│     │     │  │  │  ├─ WKS.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ mxbase.py
│     │     │  │  ├─ nsbase.py
│     │     │  │  ├─ svcbbase.py
│     │     │  │  ├─ tlsabase.py
│     │     │  │  ├─ txtbase.py
│     │     │  │  ├─ util.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ renderer.py
│     │     │  ├─ resolver.py
│     │     │  ├─ reversename.py
│     │     │  ├─ rrset.py
│     │     │  ├─ serial.py
│     │     │  ├─ set.py
│     │     │  ├─ tokenizer.py
│     │     │  ├─ transaction.py
│     │     │  ├─ tsig.py
│     │     │  ├─ tsigkeyring.py
│     │     │  ├─ ttl.py
│     │     │  ├─ update.py
│     │     │  ├─ version.py
│     │     │  ├─ versioned.py
│     │     │  ├─ win32util.py
│     │     │  ├─ wire.py
│     │     │  ├─ xfr.py
│     │     │  ├─ zone.py
│     │     │  ├─ zonefile.py
│     │     │  ├─ zonetypes.py
│     │     │  ├─ _asyncbackend.py
│     │     │  ├─ _asyncio_backend.py
│     │     │  ├─ _ddr.py
│     │     │  ├─ _features.py
│     │     │  ├─ _immutable_ctx.py
│     │     │  ├─ _no_ssl.py
│     │     │  ├─ _tls_util.py
│     │     │  ├─ _trio_backend.py
│     │     │  └─ __init__.py
│     │     ├─ docs
│     │     │  └─ conf.py
│     │     ├─ dotenv
│     │     │  ├─ cli.py
│     │     │  ├─ ipython.py
│     │     │  ├─ main.py
│     │     │  ├─ parser.py
│     │     │  ├─ py.typed
│     │     │  ├─ variables.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ ecdsa
│     │     │  ├─ curves.py
│     │     │  ├─ der.py
│     │     │  ├─ ecdh.py
│     │     │  ├─ ecdsa.py
│     │     │  ├─ eddsa.py
│     │     │  ├─ ellipticcurve.py
│     │     │  ├─ errors.py
│     │     │  ├─ keys.py
│     │     │  ├─ numbertheory.py
│     │     │  ├─ rfc6979.py
│     │     │  ├─ ssh.py
│     │     │  ├─ test_curves.py
│     │     │  ├─ test_der.py
│     │     │  ├─ test_ecdh.py
│     │     │  ├─ test_ecdsa.py
│     │     │  ├─ test_eddsa.py
│     │     │  ├─ test_ellipticcurve.py
│     │     │  ├─ test_jacobi.py
│     │     │  ├─ test_keys.py
│     │     │  ├─ test_malformed_sigs.py
│     │     │  ├─ test_numbertheory.py
│     │     │  ├─ test_pyecdsa.py
│     │     │  ├─ test_rw_lock.py
│     │     │  ├─ test_sha3.py
│     │     │  ├─ util.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _rwlock.py
│     │     │  ├─ _sha3.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ email_validator
│     │     │  ├─ deliverability.py
│     │     │  ├─ exceptions_types.py
│     │     │  ├─ py.typed
│     │     │  ├─ rfc_constants.py
│     │     │  ├─ syntax.py
│     │     │  ├─ validate_email.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ fastapi
│     │     │  ├─ applications.py
│     │     │  ├─ background.py
│     │     │  ├─ concurrency.py
│     │     │  ├─ datastructures.py
│     │     │  ├─ dependencies
│     │     │  │  ├─ models.py
│     │     │  │  ├─ utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ encoders.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ exception_handlers.py
│     │     │  ├─ logger.py
│     │     │  ├─ middleware
│     │     │  │  ├─ asyncexitstack.py
│     │     │  │  ├─ cors.py
│     │     │  │  ├─ gzip.py
│     │     │  │  ├─ httpsredirect.py
│     │     │  │  ├─ trustedhost.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ openapi
│     │     │  │  ├─ constants.py
│     │     │  │  ├─ docs.py
│     │     │  │  ├─ models.py
│     │     │  │  ├─ utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ params.py
│     │     │  ├─ param_functions.py
│     │     │  ├─ py.typed
│     │     │  ├─ requests.py
│     │     │  ├─ responses.py
│     │     │  ├─ routing.py
│     │     │  ├─ security
│     │     │  │  ├─ api_key.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ http.py
│     │     │  │  ├─ oauth2.py
│     │     │  │  ├─ open_id_connect_url.py
│     │     │  │  ├─ utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ staticfiles.py
│     │     │  ├─ templating.py
│     │     │  ├─ testclient.py
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ websockets.py
│     │     │  ├─ _compat.py
│     │     │  └─ __init__.py
│     │     ├─ firebase_admin
│     │     │  ├─ app_check.py
│     │     │  ├─ auth.py
│     │     │  ├─ credentials.py
│     │     │  ├─ db.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ firestore.py
│     │     │  ├─ firestore_async.py
│     │     │  ├─ instance_id.py
│     │     │  ├─ messaging.py
│     │     │  ├─ ml.py
│     │     │  ├─ project_management.py
│     │     │  ├─ storage.py
│     │     │  ├─ tenant_mgt.py
│     │     │  ├─ _auth_client.py
│     │     │  ├─ _auth_providers.py
│     │     │  ├─ _auth_utils.py
│     │     │  ├─ _gapic_utils.py
│     │     │  ├─ _http_client.py
│     │     │  ├─ _messaging_encoder.py
│     │     │  ├─ _messaging_utils.py
│     │     │  ├─ _rfc3339.py
│     │     │  ├─ _sseclient.py
│     │     │  ├─ _token_gen.py
│     │     │  ├─ _user_identifier.py
│     │     │  ├─ _user_import.py
│     │     │  ├─ _user_mgt.py
│     │     │  ├─ _utils.py
│     │     │  ├─ __about__.py
│     │     │  └─ __init__.py
│     │     ├─ fontTools
│     │     │  ├─ afmLib.py
│     │     │  ├─ agl.py
│     │     │  ├─ annotations.py
│     │     │  ├─ cffLib
│     │     │  │  ├─ CFF2ToCFF.py
│     │     │  │  ├─ CFFToCFF2.py
│     │     │  │  ├─ specializer.py
│     │     │  │  ├─ transforms.py
│     │     │  │  ├─ width.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ colorLib
│     │     │  │  ├─ builder.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ geometry.py
│     │     │  │  ├─ table_builder.py
│     │     │  │  ├─ unbuilder.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ config
│     │     │  │  └─ __init__.py
│     │     │  ├─ cu2qu
│     │     │  │  ├─ benchmark.py
│     │     │  │  ├─ cli.py
│     │     │  │  ├─ cu2qu.c
│     │     │  │  ├─ cu2qu.cp312-win_amd64.pyd
│     │     │  │  ├─ cu2qu.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ ufo.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ designspaceLib
│     │     │  │  ├─ split.py
│     │     │  │  ├─ statNames.py
│     │     │  │  ├─ types.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ encodings
│     │     │  │  ├─ codecs.py
│     │     │  │  ├─ MacRoman.py
│     │     │  │  ├─ StandardEncoding.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ feaLib
│     │     │  │  ├─ ast.py
│     │     │  │  ├─ builder.py
│     │     │  │  ├─ error.py
│     │     │  │  ├─ lexer.c
│     │     │  │  ├─ lexer.cp312-win_amd64.pyd
│     │     │  │  ├─ lexer.py
│     │     │  │  ├─ location.py
│     │     │  │  ├─ lookupDebugInfo.py
│     │     │  │  ├─ parser.py
│     │     │  │  ├─ variableScalar.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ fontBuilder.py
│     │     │  ├─ help.py
│     │     │  ├─ merge
│     │     │  │  ├─ base.py
│     │     │  │  ├─ cmap.py
│     │     │  │  ├─ layout.py
│     │     │  │  ├─ options.py
│     │     │  │  ├─ tables.py
│     │     │  │  ├─ unicode.py
│     │     │  │  ├─ util.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ misc
│     │     │  │  ├─ arrayTools.py
│     │     │  │  ├─ bezierTools.c
│     │     │  │  ├─ bezierTools.cp312-win_amd64.pyd
│     │     │  │  ├─ bezierTools.py
│     │     │  │  ├─ classifyTools.py
│     │     │  │  ├─ cliTools.py
│     │     │  │  ├─ configTools.py
│     │     │  │  ├─ cython.py
│     │     │  │  ├─ dictTools.py
│     │     │  │  ├─ eexec.py
│     │     │  │  ├─ encodingTools.py
│     │     │  │  ├─ enumTools.py
│     │     │  │  ├─ etree.py
│     │     │  │  ├─ filenames.py
│     │     │  │  ├─ filesystem
│     │     │  │  │  ├─ _base.py
│     │     │  │  │  ├─ _copy.py
│     │     │  │  │  ├─ _errors.py
│     │     │  │  │  ├─ _info.py
│     │     │  │  │  ├─ _osfs.py
│     │     │  │  │  ├─ _path.py
│     │     │  │  │  ├─ _subfs.py
│     │     │  │  │  ├─ _tempfs.py
│     │     │  │  │  ├─ _tools.py
│     │     │  │  │  ├─ _walk.py
│     │     │  │  │  ├─ _zipfs.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ fixedTools.py
│     │     │  │  ├─ intTools.py
│     │     │  │  ├─ iterTools.py
│     │     │  │  ├─ lazyTools.py
│     │     │  │  ├─ loggingTools.py
│     │     │  │  ├─ macCreatorType.py
│     │     │  │  ├─ macRes.py
│     │     │  │  ├─ plistlib
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ psCharStrings.py
│     │     │  │  ├─ psLib.py
│     │     │  │  ├─ psOperators.py
│     │     │  │  ├─ py23.py
│     │     │  │  ├─ roundTools.py
│     │     │  │  ├─ sstruct.py
│     │     │  │  ├─ symfont.py
│     │     │  │  ├─ testTools.py
│     │     │  │  ├─ textTools.py
│     │     │  │  ├─ timeTools.py
│     │     │  │  ├─ transform.py
│     │     │  │  ├─ treeTools.py
│     │     │  │  ├─ vector.py
│     │     │  │  ├─ visitor.py
│     │     │  │  ├─ xmlReader.py
│     │     │  │  ├─ xmlWriter.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ mtiLib
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ otlLib
│     │     │  │  ├─ builder.py
│     │     │  │  ├─ error.py
│     │     │  │  ├─ maxContextCalc.py
│     │     │  │  ├─ optimize
│     │     │  │  │  ├─ gpos.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ pens
│     │     │  │  ├─ areaPen.py
│     │     │  │  ├─ basePen.py
│     │     │  │  ├─ boundsPen.py
│     │     │  │  ├─ cairoPen.py
│     │     │  │  ├─ cocoaPen.py
│     │     │  │  ├─ cu2quPen.py
│     │     │  │  ├─ explicitClosingLinePen.py
│     │     │  │  ├─ filterPen.py
│     │     │  │  ├─ freetypePen.py
│     │     │  │  ├─ hashPointPen.py
│     │     │  │  ├─ momentsPen.c
│     │     │  │  ├─ momentsPen.cp312-win_amd64.pyd
│     │     │  │  ├─ momentsPen.py
│     │     │  │  ├─ perimeterPen.py
│     │     │  │  ├─ pointInsidePen.py
│     │     │  │  ├─ pointPen.py
│     │     │  │  ├─ qtPen.py
│     │     │  │  ├─ qu2cuPen.py
│     │     │  │  ├─ quartzPen.py
│     │     │  │  ├─ recordingPen.py
│     │     │  │  ├─ reportLabPen.py
│     │     │  │  ├─ reverseContourPen.py
│     │     │  │  ├─ roundingPen.py
│     │     │  │  ├─ statisticsPen.py
│     │     │  │  ├─ svgPathPen.py
│     │     │  │  ├─ t2CharStringPen.py
│     │     │  │  ├─ teePen.py
│     │     │  │  ├─ transformPen.py
│     │     │  │  ├─ ttGlyphPen.py
│     │     │  │  ├─ wxPen.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ qu2cu
│     │     │  │  ├─ benchmark.py
│     │     │  │  ├─ cli.py
│     │     │  │  ├─ qu2cu.c
│     │     │  │  ├─ qu2cu.cp312-win_amd64.pyd
│     │     │  │  ├─ qu2cu.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ subset
│     │     │  │  ├─ cff.py
│     │     │  │  ├─ svg.py
│     │     │  │  ├─ util.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ svgLib
│     │     │  │  ├─ path
│     │     │  │  │  ├─ arc.py
│     │     │  │  │  ├─ parser.py
│     │     │  │  │  ├─ shapes.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ t1Lib
│     │     │  │  └─ __init__.py
│     │     │  ├─ tfmLib.py
│     │     │  ├─ ttLib
│     │     │  │  ├─ macUtils.py
│     │     │  │  ├─ removeOverlaps.py
│     │     │  │  ├─ reorderGlyphs.py
│     │     │  │  ├─ scaleUpem.py
│     │     │  │  ├─ sfnt.py
│     │     │  │  ├─ standardGlyphOrder.py
│     │     │  │  ├─ tables
│     │     │  │  │  ├─ asciiTable.py
│     │     │  │  │  ├─ BitmapGlyphMetrics.py
│     │     │  │  │  ├─ B_A_S_E_.py
│     │     │  │  │  ├─ C_B_D_T_.py
│     │     │  │  │  ├─ C_B_L_C_.py
│     │     │  │  │  ├─ C_F_F_.py
│     │     │  │  │  ├─ C_F_F__2.py
│     │     │  │  │  ├─ C_O_L_R_.py
│     │     │  │  │  ├─ C_P_A_L_.py
│     │     │  │  │  ├─ DefaultTable.py
│     │     │  │  │  ├─ D_S_I_G_.py
│     │     │  │  │  ├─ D__e_b_g.py
│     │     │  │  │  ├─ E_B_D_T_.py
│     │     │  │  │  ├─ E_B_L_C_.py
│     │     │  │  │  ├─ F_F_T_M_.py
│     │     │  │  │  ├─ F__e_a_t.py
│     │     │  │  │  ├─ grUtils.py
│     │     │  │  │  ├─ G_D_E_F_.py
│     │     │  │  │  ├─ G_M_A_P_.py
│     │     │  │  │  ├─ G_P_K_G_.py
│     │     │  │  │  ├─ G_P_O_S_.py
│     │     │  │  │  ├─ G_S_U_B_.py
│     │     │  │  │  ├─ G_V_A_R_.py
│     │     │  │  │  ├─ G__l_a_t.py
│     │     │  │  │  ├─ G__l_o_c.py
│     │     │  │  │  ├─ H_V_A_R_.py
│     │     │  │  │  ├─ J_S_T_F_.py
│     │     │  │  │  ├─ L_T_S_H_.py
│     │     │  │  │  ├─ M_A_T_H_.py
│     │     │  │  │  ├─ M_E_T_A_.py
│     │     │  │  │  ├─ M_V_A_R_.py
│     │     │  │  │  ├─ otBase.py
│     │     │  │  │  ├─ otConverters.py
│     │     │  │  │  ├─ otData.py
│     │     │  │  │  ├─ otTables.py
│     │     │  │  │  ├─ otTraverse.py
│     │     │  │  │  ├─ O_S_2f_2.py
│     │     │  │  │  ├─ sbixGlyph.py
│     │     │  │  │  ├─ sbixStrike.py
│     │     │  │  │  ├─ S_I_N_G_.py
│     │     │  │  │  ├─ S_T_A_T_.py
│     │     │  │  │  ├─ S_V_G_.py
│     │     │  │  │  ├─ S__i_l_f.py
│     │     │  │  │  ├─ S__i_l_l.py
│     │     │  │  │  ├─ table_API_readme.txt
│     │     │  │  │  ├─ ttProgram.py
│     │     │  │  │  ├─ TupleVariation.py
│     │     │  │  │  ├─ T_S_I_B_.py
│     │     │  │  │  ├─ T_S_I_C_.py
│     │     │  │  │  ├─ T_S_I_D_.py
│     │     │  │  │  ├─ T_S_I_J_.py
│     │     │  │  │  ├─ T_S_I_P_.py
│     │     │  │  │  ├─ T_S_I_S_.py
│     │     │  │  │  ├─ T_S_I_V_.py
│     │     │  │  │  ├─ T_S_I__0.py
│     │     │  │  │  ├─ T_S_I__1.py
│     │     │  │  │  ├─ T_S_I__2.py
│     │     │  │  │  ├─ T_S_I__3.py
│     │     │  │  │  ├─ T_S_I__5.py
│     │     │  │  │  ├─ T_T_F_A_.py
│     │     │  │  │  ├─ V_A_R_C_.py
│     │     │  │  │  ├─ V_D_M_X_.py
│     │     │  │  │  ├─ V_O_R_G_.py
│     │     │  │  │  ├─ V_V_A_R_.py
│     │     │  │  │  ├─ _a_n_k_r.py
│     │     │  │  │  ├─ _a_v_a_r.py
│     │     │  │  │  ├─ _b_s_l_n.py
│     │     │  │  │  ├─ _c_i_d_g.py
│     │     │  │  │  ├─ _c_m_a_p.py
│     │     │  │  │  ├─ _c_v_a_r.py
│     │     │  │  │  ├─ _c_v_t.py
│     │     │  │  │  ├─ _f_e_a_t.py
│     │     │  │  │  ├─ _f_p_g_m.py
│     │     │  │  │  ├─ _f_v_a_r.py
│     │     │  │  │  ├─ _g_a_s_p.py
│     │     │  │  │  ├─ _g_c_i_d.py
│     │     │  │  │  ├─ _g_l_y_f.py
│     │     │  │  │  ├─ _g_v_a_r.py
│     │     │  │  │  ├─ _h_d_m_x.py
│     │     │  │  │  ├─ _h_e_a_d.py
│     │     │  │  │  ├─ _h_h_e_a.py
│     │     │  │  │  ├─ _h_m_t_x.py
│     │     │  │  │  ├─ _k_e_r_n.py
│     │     │  │  │  ├─ _l_c_a_r.py
│     │     │  │  │  ├─ _l_o_c_a.py
│     │     │  │  │  ├─ _l_t_a_g.py
│     │     │  │  │  ├─ _m_a_x_p.py
│     │     │  │  │  ├─ _m_e_t_a.py
│     │     │  │  │  ├─ _m_o_r_t.py
│     │     │  │  │  ├─ _m_o_r_x.py
│     │     │  │  │  ├─ _n_a_m_e.py
│     │     │  │  │  ├─ _o_p_b_d.py
│     │     │  │  │  ├─ _p_o_s_t.py
│     │     │  │  │  ├─ _p_r_e_p.py
│     │     │  │  │  ├─ _p_r_o_p.py
│     │     │  │  │  ├─ _s_b_i_x.py
│     │     │  │  │  ├─ _t_r_a_k.py
│     │     │  │  │  ├─ _v_h_e_a.py
│     │     │  │  │  ├─ _v_m_t_x.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ ttCollection.py
│     │     │  │  ├─ ttFont.py
│     │     │  │  ├─ ttGlyphSet.py
│     │     │  │  ├─ ttVisitor.py
│     │     │  │  ├─ woff2.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ ttx.py
│     │     │  ├─ ufoLib
│     │     │  │  ├─ converters.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ etree.py
│     │     │  │  ├─ filenames.py
│     │     │  │  ├─ glifLib.py
│     │     │  │  ├─ kerning.py
│     │     │  │  ├─ plistlib.py
│     │     │  │  ├─ pointPen.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ validators.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ unicode.py
│     │     │  ├─ unicodedata
│     │     │  │  ├─ Blocks.py
│     │     │  │  ├─ Mirrored.py
│     │     │  │  ├─ OTTags.py
│     │     │  │  ├─ ScriptExtensions.py
│     │     │  │  ├─ Scripts.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ varLib
│     │     │  │  ├─ avar
│     │     │  │  │  ├─ build.py
│     │     │  │  │  ├─ map.py
│     │     │  │  │  ├─ plan.py
│     │     │  │  │  ├─ unbuild.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ avarPlanner.py
│     │     │  │  ├─ builder.py
│     │     │  │  ├─ cff.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ featureVars.py
│     │     │  │  ├─ hvar.py
│     │     │  │  ├─ instancer
│     │     │  │  │  ├─ featureVars.py
│     │     │  │  │  ├─ names.py
│     │     │  │  │  ├─ solver.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ interpolatable.py
│     │     │  │  ├─ interpolatableHelpers.py
│     │     │  │  ├─ interpolatablePlot.py
│     │     │  │  ├─ interpolatableTestContourOrder.py
│     │     │  │  ├─ interpolatableTestStartingPoint.py
│     │     │  │  ├─ interpolate_layout.py
│     │     │  │  ├─ iup.c
│     │     │  │  ├─ iup.cp312-win_amd64.pyd
│     │     │  │  ├─ iup.py
│     │     │  │  ├─ merger.py
│     │     │  │  ├─ models.py
│     │     │  │  ├─ multiVarStore.py
│     │     │  │  ├─ mutator.py
│     │     │  │  ├─ mvar.py
│     │     │  │  ├─ plot.py
│     │     │  │  ├─ stat.py
│     │     │  │  ├─ varStore.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ voltLib
│     │     │  │  ├─ ast.py
│     │     │  │  ├─ error.py
│     │     │  │  ├─ lexer.py
│     │     │  │  ├─ parser.py
│     │     │  │  ├─ voltToFea.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ fpdf
│     │     │  ├─ actions.py
│     │     │  ├─ annotations.py
│     │     │  ├─ deprecation.py
│     │     │  ├─ drawing.py
│     │     │  ├─ encryption.py
│     │     │  ├─ enums.py
│     │     │  ├─ errors.py
│     │     │  ├─ fonts.py
│     │     │  ├─ fpdf.py
│     │     │  ├─ graphics_state.py
│     │     │  ├─ html.py
│     │     │  ├─ image_parsing.py
│     │     │  ├─ linearization.py
│     │     │  ├─ line_break.py
│     │     │  ├─ outline.py
│     │     │  ├─ output.py
│     │     │  ├─ prefs.py
│     │     │  ├─ recorder.py
│     │     │  ├─ sign.py
│     │     │  ├─ structure_tree.py
│     │     │  ├─ svg.py
│     │     │  ├─ syntax.py
│     │     │  ├─ table.py
│     │     │  ├─ template.py
│     │     │  ├─ text_region.py
│     │     │  ├─ transitions.py
│     │     │  ├─ util.py
│     │     │  └─ __init__.py
│     │     ├─ frozenlist
│     │     │  ├─ py.typed
│     │     │  ├─ _frozenlist.cp312-win_amd64.pyd
│     │     │  ├─ _frozenlist.pyx
│     │     │  ├─ __init__.py
│     │     │  └─ __init__.pyi
│     │     ├─ google
│     │     │  ├─ api
│     │     │  │  ├─ annotations.proto
│     │     │  │  ├─ annotations_pb2.py
│     │     │  │  ├─ annotations_pb2.pyi
│     │     │  │  ├─ auth.proto
│     │     │  │  ├─ auth_pb2.py
│     │     │  │  ├─ auth_pb2.pyi
│     │     │  │  ├─ backend.proto
│     │     │  │  ├─ backend_pb2.py
│     │     │  │  ├─ backend_pb2.pyi
│     │     │  │  ├─ billing.proto
│     │     │  │  ├─ billing_pb2.py
│     │     │  │  ├─ billing_pb2.pyi
│     │     │  │  ├─ client.proto
│     │     │  │  ├─ client_pb2.py
│     │     │  │  ├─ client_pb2.pyi
│     │     │  │  ├─ config_change.proto
│     │     │  │  ├─ config_change_pb2.py
│     │     │  │  ├─ config_change_pb2.pyi
│     │     │  │  ├─ consumer.proto
│     │     │  │  ├─ consumer_pb2.py
│     │     │  │  ├─ consumer_pb2.pyi
│     │     │  │  ├─ context.proto
│     │     │  │  ├─ context_pb2.py
│     │     │  │  ├─ context_pb2.pyi
│     │     │  │  ├─ control.proto
│     │     │  │  ├─ control_pb2.py
│     │     │  │  ├─ control_pb2.pyi
│     │     │  │  ├─ documentation.proto
│     │     │  │  ├─ documentation_pb2.py
│     │     │  │  ├─ documentation_pb2.pyi
│     │     │  │  ├─ endpoint.proto
│     │     │  │  ├─ endpoint_pb2.py
│     │     │  │  ├─ endpoint_pb2.pyi
│     │     │  │  ├─ error_reason.proto
│     │     │  │  ├─ error_reason_pb2.py
│     │     │  │  ├─ error_reason_pb2.pyi
│     │     │  │  ├─ field_behavior.proto
│     │     │  │  ├─ field_behavior_pb2.py
│     │     │  │  ├─ field_behavior_pb2.pyi
│     │     │  │  ├─ field_info.proto
│     │     │  │  ├─ field_info_pb2.py
│     │     │  │  ├─ field_info_pb2.pyi
│     │     │  │  ├─ http.proto
│     │     │  │  ├─ httpbody.proto
│     │     │  │  ├─ httpbody_pb2.py
│     │     │  │  ├─ httpbody_pb2.pyi
│     │     │  │  ├─ http_pb2.py
│     │     │  │  ├─ http_pb2.pyi
│     │     │  │  ├─ label.proto
│     │     │  │  ├─ label_pb2.py
│     │     │  │  ├─ label_pb2.pyi
│     │     │  │  ├─ launch_stage.proto
│     │     │  │  ├─ launch_stage_pb2.py
│     │     │  │  ├─ launch_stage_pb2.pyi
│     │     │  │  ├─ log.proto
│     │     │  │  ├─ logging.proto
│     │     │  │  ├─ logging_pb2.py
│     │     │  │  ├─ logging_pb2.pyi
│     │     │  │  ├─ log_pb2.py
│     │     │  │  ├─ log_pb2.pyi
│     │     │  │  ├─ metric.proto
│     │     │  │  ├─ metric_pb2.py
│     │     │  │  ├─ metric_pb2.pyi
│     │     │  │  ├─ monitored_resource.proto
│     │     │  │  ├─ monitored_resource_pb2.py
│     │     │  │  ├─ monitored_resource_pb2.pyi
│     │     │  │  ├─ monitoring.proto
│     │     │  │  ├─ monitoring_pb2.py
│     │     │  │  ├─ monitoring_pb2.pyi
│     │     │  │  ├─ policy.proto
│     │     │  │  ├─ policy_pb2.py
│     │     │  │  ├─ policy_pb2.pyi
│     │     │  │  ├─ quota.proto
│     │     │  │  ├─ quota_pb2.py
│     │     │  │  ├─ quota_pb2.pyi
│     │     │  │  ├─ resource.proto
│     │     │  │  ├─ resource_pb2.py
│     │     │  │  ├─ resource_pb2.pyi
│     │     │  │  ├─ routing.proto
│     │     │  │  ├─ routing_pb2.py
│     │     │  │  ├─ routing_pb2.pyi
│     │     │  │  ├─ service.proto
│     │     │  │  ├─ service_pb2.py
│     │     │  │  ├─ service_pb2.pyi
│     │     │  │  ├─ source_info.proto
│     │     │  │  ├─ source_info_pb2.py
│     │     │  │  ├─ source_info_pb2.pyi
│     │     │  │  ├─ system_parameter.proto
│     │     │  │  ├─ system_parameter_pb2.py
│     │     │  │  ├─ system_parameter_pb2.pyi
│     │     │  │  ├─ usage.proto
│     │     │  │  ├─ usage_pb2.py
│     │     │  │  ├─ usage_pb2.pyi
│     │     │  │  ├─ visibility.proto
│     │     │  │  ├─ visibility_pb2.py
│     │     │  │  └─ visibility_pb2.pyi
│     │     │  ├─ api_core
│     │     │  │  ├─ bidi.py
│     │     │  │  ├─ bidi_async.py
│     │     │  │  ├─ bidi_base.py
│     │     │  │  ├─ client_info.py
│     │     │  │  ├─ client_logging.py
│     │     │  │  ├─ client_options.py
│     │     │  │  ├─ datetime_helpers.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ extended_operation.py
│     │     │  │  ├─ future
│     │     │  │  │  ├─ async_future.py
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ polling.py
│     │     │  │  │  ├─ _helpers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ gapic_v1
│     │     │  │  │  ├─ client_info.py
│     │     │  │  │  ├─ config.py
│     │     │  │  │  ├─ config_async.py
│     │     │  │  │  ├─ method.py
│     │     │  │  │  ├─ method_async.py
│     │     │  │  │  ├─ routing_header.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ general_helpers.py
│     │     │  │  ├─ grpc_helpers.py
│     │     │  │  ├─ grpc_helpers_async.py
│     │     │  │  ├─ iam.py
│     │     │  │  ├─ operation.py
│     │     │  │  ├─ operations_v1
│     │     │  │  │  ├─ abstract_operations_base_client.py
│     │     │  │  │  ├─ abstract_operations_client.py
│     │     │  │  │  ├─ operations_async_client.py
│     │     │  │  │  ├─ operations_client.py
│     │     │  │  │  ├─ operations_client_config.py
│     │     │  │  │  ├─ operations_rest_client_async.py
│     │     │  │  │  ├─ pagers.py
│     │     │  │  │  ├─ pagers_async.py
│     │     │  │  │  ├─ pagers_base.py
│     │     │  │  │  ├─ transports
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ rest.py
│     │     │  │  │  │  ├─ rest_asyncio.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ operation_async.py
│     │     │  │  ├─ page_iterator.py
│     │     │  │  ├─ page_iterator_async.py
│     │     │  │  ├─ path_template.py
│     │     │  │  ├─ protobuf_helpers.py
│     │     │  │  ├─ py.typed
│     │     │  │  ├─ rest_helpers.py
│     │     │  │  ├─ rest_streaming.py
│     │     │  │  ├─ rest_streaming_async.py
│     │     │  │  ├─ retry
│     │     │  │  │  ├─ retry_base.py
│     │     │  │  │  ├─ retry_streaming.py
│     │     │  │  │  ├─ retry_streaming_async.py
│     │     │  │  │  ├─ retry_unary.py
│     │     │  │  │  ├─ retry_unary_async.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ retry_async.py
│     │     │  │  ├─ timeout.py
│     │     │  │  ├─ universe.py
│     │     │  │  ├─ version.py
│     │     │  │  ├─ version_header.py
│     │     │  │  ├─ _python_package_support.py
│     │     │  │  ├─ _python_version_support.py
│     │     │  │  ├─ _rest_streaming_base.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ auth
│     │     │  │  ├─ api_key.py
│     │     │  │  ├─ app_engine.py
│     │     │  │  ├─ aws.py
│     │     │  │  ├─ compute_engine
│     │     │  │  │  ├─ credentials.py
│     │     │  │  │  ├─ _metadata.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ credentials.py
│     │     │  │  ├─ crypt
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ es256.py
│     │     │  │  │  ├─ rsa.py
│     │     │  │  │  ├─ _cryptography_rsa.py
│     │     │  │  │  ├─ _helpers.py
│     │     │  │  │  ├─ _python_rsa.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ downscoped.py
│     │     │  │  ├─ environment_vars.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ external_account.py
│     │     │  │  ├─ external_account_authorized_user.py
│     │     │  │  ├─ iam.py
│     │     │  │  ├─ identity_pool.py
│     │     │  │  ├─ impersonated_credentials.py
│     │     │  │  ├─ jwt.py
│     │     │  │  ├─ metrics.py
│     │     │  │  ├─ pluggable.py
│     │     │  │  ├─ transport
│     │     │  │  │  ├─ grpc.py
│     │     │  │  │  ├─ mtls.py
│     │     │  │  │  ├─ requests.py
│     │     │  │  │  ├─ urllib3.py
│     │     │  │  │  ├─ _aiohttp_requests.py
│     │     │  │  │  ├─ _custom_tls_signer.py
│     │     │  │  │  ├─ _http_client.py
│     │     │  │  │  ├─ _mtls_helper.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ version.py
│     │     │  │  ├─ _cloud_sdk.py
│     │     │  │  ├─ _credentials_async.py
│     │     │  │  ├─ _default.py
│     │     │  │  ├─ _default_async.py
│     │     │  │  ├─ _exponential_backoff.py
│     │     │  │  ├─ _helpers.py
│     │     │  │  ├─ _jwt_async.py
│     │     │  │  ├─ _oauth2client.py
│     │     │  │  ├─ _service_account_info.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ cloud
│     │     │  │  ├─ client
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ common_resources.proto
│     │     │  │  ├─ common_resources_pb2.py
│     │     │  │  ├─ common_resources_pb2.pyi
│     │     │  │  ├─ environment_vars
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ exceptions
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ extended_operations.proto
│     │     │  │  ├─ extended_operations_pb2.py
│     │     │  │  ├─ extended_operations_pb2.pyi
│     │     │  │  ├─ firestore
│     │     │  │  │  ├─ gapic_version.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ firestore_admin_v1
│     │     │  │  │  ├─ gapic_metadata.json
│     │     │  │  │  ├─ gapic_version.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ services
│     │     │  │  │  │  ├─ firestore_admin
│     │     │  │  │  │  │  ├─ async_client.py
│     │     │  │  │  │  │  ├─ client.py
│     │     │  │  │  │  │  ├─ pagers.py
│     │     │  │  │  │  │  ├─ transports
│     │     │  │  │  │  │  │  ├─ base.py
│     │     │  │  │  │  │  │  ├─ grpc.py
│     │     │  │  │  │  │  │  ├─ grpc_asyncio.py
│     │     │  │  │  │  │  │  ├─ rest.py
│     │     │  │  │  │  │  │  ├─ rest_base.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ types
│     │     │  │  │  │  ├─ backup.py
│     │     │  │  │  │  ├─ database.py
│     │     │  │  │  │  ├─ field.py
│     │     │  │  │  │  ├─ firestore_admin.py
│     │     │  │  │  │  ├─ index.py
│     │     │  │  │  │  ├─ location.py
│     │     │  │  │  │  ├─ operation.py
│     │     │  │  │  │  ├─ schedule.py
│     │     │  │  │  │  ├─ user_creds.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ firestore_bundle
│     │     │  │  │  ├─ bundle.py
│     │     │  │  │  ├─ gapic_metadata.json
│     │     │  │  │  ├─ gapic_version.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ services
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ types
│     │     │  │  │  │  ├─ bundle.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ _helpers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ firestore_v1
│     │     │  │  │  ├─ aggregation.py
│     │     │  │  │  ├─ async_aggregation.py
│     │     │  │  │  ├─ async_batch.py
│     │     │  │  │  ├─ async_client.py
│     │     │  │  │  ├─ async_collection.py
│     │     │  │  │  ├─ async_document.py
│     │     │  │  │  ├─ async_query.py
│     │     │  │  │  ├─ async_stream_generator.py
│     │     │  │  │  ├─ async_transaction.py
│     │     │  │  │  ├─ async_vector_query.py
│     │     │  │  │  ├─ base_aggregation.py
│     │     │  │  │  ├─ base_batch.py
│     │     │  │  │  ├─ base_client.py
│     │     │  │  │  ├─ base_collection.py
│     │     │  │  │  ├─ base_document.py
│     │     │  │  │  ├─ base_query.py
│     │     │  │  │  ├─ base_transaction.py
│     │     │  │  │  ├─ base_vector_query.py
│     │     │  │  │  ├─ batch.py
│     │     │  │  │  ├─ bulk_batch.py
│     │     │  │  │  ├─ bulk_writer.py
│     │     │  │  │  ├─ client.py
│     │     │  │  │  ├─ collection.py
│     │     │  │  │  ├─ document.py
│     │     │  │  │  ├─ field_path.py
│     │     │  │  │  ├─ gapic_metadata.json
│     │     │  │  │  ├─ gapic_version.py
│     │     │  │  │  ├─ order.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ query.py
│     │     │  │  │  ├─ query_profile.py
│     │     │  │  │  ├─ query_results.py
│     │     │  │  │  ├─ rate_limiter.py
│     │     │  │  │  ├─ services
│     │     │  │  │  │  ├─ firestore
│     │     │  │  │  │  │  ├─ async_client.py
│     │     │  │  │  │  │  ├─ client.py
│     │     │  │  │  │  │  ├─ pagers.py
│     │     │  │  │  │  │  ├─ transports
│     │     │  │  │  │  │  │  ├─ base.py
│     │     │  │  │  │  │  │  ├─ grpc.py
│     │     │  │  │  │  │  │  ├─ grpc_asyncio.py
│     │     │  │  │  │  │  │  ├─ rest.py
│     │     │  │  │  │  │  │  ├─ rest_base.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ stream_generator.py
│     │     │  │  │  ├─ transaction.py
│     │     │  │  │  ├─ transforms.py
│     │     │  │  │  ├─ types
│     │     │  │  │  │  ├─ aggregation_result.py
│     │     │  │  │  │  ├─ bloom_filter.py
│     │     │  │  │  │  ├─ common.py
│     │     │  │  │  │  ├─ document.py
│     │     │  │  │  │  ├─ firestore.py
│     │     │  │  │  │  ├─ query.py
│     │     │  │  │  │  ├─ query_profile.py
│     │     │  │  │  │  ├─ write.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ vector.py
│     │     │  │  │  ├─ vector_query.py
│     │     │  │  │  ├─ watch.py
│     │     │  │  │  ├─ _helpers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ location
│     │     │  │  │  ├─ locations.proto
│     │     │  │  │  ├─ locations_pb2.py
│     │     │  │  │  └─ locations_pb2.pyi
│     │     │  │  ├─ obsolete
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ operation
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ storage
│     │     │  │  │  ├─ acl.py
│     │     │  │  │  ├─ batch.py
│     │     │  │  │  ├─ blob.py
│     │     │  │  │  ├─ bucket.py
│     │     │  │  │  ├─ client.py
│     │     │  │  │  ├─ constants.py
│     │     │  │  │  ├─ fileio.py
│     │     │  │  │  ├─ hmac_key.py
│     │     │  │  │  ├─ iam.py
│     │     │  │  │  ├─ notification.py
│     │     │  │  │  ├─ retry.py
│     │     │  │  │  ├─ transfer_manager.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ _helpers.py
│     │     │  │  │  ├─ _http.py
│     │     │  │  │  ├─ _signing.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ version.py
│     │     │  │  ├─ _helpers
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ _http
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ _testing
│     │     │  │     ├─ py.typed
│     │     │  │     └─ __init__.py
│     │     │  ├─ gapic
│     │     │  │  └─ metadata
│     │     │  │     ├─ gapic_metadata.proto
│     │     │  │     ├─ gapic_metadata_pb2.py
│     │     │  │     └─ gapic_metadata_pb2.pyi
│     │     │  ├─ logging
│     │     │  │  └─ type
│     │     │  │     ├─ http_request.proto
│     │     │  │     ├─ http_request_pb2.py
│     │     │  │     ├─ http_request_pb2.pyi
│     │     │  │     ├─ log_severity.proto
│     │     │  │     ├─ log_severity_pb2.py
│     │     │  │     └─ log_severity_pb2.pyi
│     │     │  ├─ longrunning
│     │     │  │  ├─ operations_grpc.py
│     │     │  │  ├─ operations_grpc_pb2.py
│     │     │  │  ├─ operations_pb2.py
│     │     │  │  ├─ operations_pb2_grpc.py
│     │     │  │  ├─ operations_proto.proto
│     │     │  │  ├─ operations_proto.py
│     │     │  │  ├─ operations_proto_pb2.py
│     │     │  │  └─ operations_proto_pb2.pyi
│     │     │  ├─ oauth2
│     │     │  │  ├─ challenges.py
│     │     │  │  ├─ credentials.py
│     │     │  │  ├─ gdch_credentials.py
│     │     │  │  ├─ id_token.py
│     │     │  │  ├─ reauth.py
│     │     │  │  ├─ service_account.py
│     │     │  │  ├─ sts.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ _client.py
│     │     │  │  ├─ _client_async.py
│     │     │  │  ├─ _credentials_async.py
│     │     │  │  ├─ _id_token_async.py
│     │     │  │  ├─ _reauth_async.py
│     │     │  │  ├─ _service_account_async.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ protobuf
│     │     │  │  ├─ any.py
│     │     │  │  ├─ any_pb2.py
│     │     │  │  ├─ api_pb2.py
│     │     │  │  ├─ compiler
│     │     │  │  │  ├─ plugin_pb2.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ descriptor.py
│     │     │  │  ├─ descriptor_database.py
│     │     │  │  ├─ descriptor_pb2.py
│     │     │  │  ├─ descriptor_pool.py
│     │     │  │  ├─ duration.py
│     │     │  │  ├─ duration_pb2.py
│     │     │  │  ├─ empty_pb2.py
│     │     │  │  ├─ field_mask_pb2.py
│     │     │  │  ├─ internal
│     │     │  │  │  ├─ api_implementation.py
│     │     │  │  │  ├─ builder.py
│     │     │  │  │  ├─ containers.py
│     │     │  │  │  ├─ decoder.py
│     │     │  │  │  ├─ encoder.py
│     │     │  │  │  ├─ enum_type_wrapper.py
│     │     │  │  │  ├─ extension_dict.py
│     │     │  │  │  ├─ field_mask.py
│     │     │  │  │  ├─ message_listener.py
│     │     │  │  │  ├─ python_edition_defaults.py
│     │     │  │  │  ├─ python_message.py
│     │     │  │  │  ├─ testing_refleaks.py
│     │     │  │  │  ├─ type_checkers.py
│     │     │  │  │  ├─ well_known_types.py
│     │     │  │  │  ├─ wire_format.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ json_format.py
│     │     │  │  ├─ message.py
│     │     │  │  ├─ message_factory.py
│     │     │  │  ├─ proto.py
│     │     │  │  ├─ proto_builder.py
│     │     │  │  ├─ proto_json.py
│     │     │  │  ├─ proto_text.py
│     │     │  │  ├─ pyext
│     │     │  │  │  ├─ cpp_message.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ reflection.py
│     │     │  │  ├─ runtime_version.py
│     │     │  │  ├─ service_reflection.py
│     │     │  │  ├─ source_context_pb2.py
│     │     │  │  ├─ struct_pb2.py
│     │     │  │  ├─ symbol_database.py
│     │     │  │  ├─ testdata
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ text_encoding.py
│     │     │  │  ├─ text_format.py
│     │     │  │  ├─ timestamp.py
│     │     │  │  ├─ timestamp_pb2.py
│     │     │  │  ├─ type_pb2.py
│     │     │  │  ├─ unknown_fields.py
│     │     │  │  ├─ util
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ wrappers_pb2.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ resumable_media
│     │     │  │  ├─ common.py
│     │     │  │  ├─ py.typed
│     │     │  │  ├─ requests
│     │     │  │  │  ├─ download.py
│     │     │  │  │  ├─ upload.py
│     │     │  │  │  ├─ _request_helpers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ _download.py
│     │     │  │  ├─ _helpers.py
│     │     │  │  ├─ _upload.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ rpc
│     │     │  │  ├─ code.proto
│     │     │  │  ├─ code_pb2.py
│     │     │  │  ├─ code_pb2.pyi
│     │     │  │  ├─ context
│     │     │  │  │  ├─ attribute_context.proto
│     │     │  │  │  ├─ attribute_context_pb2.py
│     │     │  │  │  ├─ attribute_context_pb2.pyi
│     │     │  │  │  ├─ audit_context.proto
│     │     │  │  │  ├─ audit_context_pb2.py
│     │     │  │  │  └─ audit_context_pb2.pyi
│     │     │  │  ├─ error_details.proto
│     │     │  │  ├─ error_details_pb2.py
│     │     │  │  ├─ error_details_pb2.pyi
│     │     │  │  ├─ http.proto
│     │     │  │  ├─ http_pb2.py
│     │     │  │  ├─ http_pb2.pyi
│     │     │  │  ├─ status.proto
│     │     │  │  ├─ status_pb2.py
│     │     │  │  └─ status_pb2.pyi
│     │     │  ├─ type
│     │     │  │  ├─ calendar_period.proto
│     │     │  │  ├─ calendar_period_pb2.py
│     │     │  │  ├─ calendar_period_pb2.pyi
│     │     │  │  ├─ color.proto
│     │     │  │  ├─ color_pb2.py
│     │     │  │  ├─ color_pb2.pyi
│     │     │  │  ├─ date.proto
│     │     │  │  ├─ datetime.proto
│     │     │  │  ├─ datetime_pb2.py
│     │     │  │  ├─ datetime_pb2.pyi
│     │     │  │  ├─ date_pb2.py
│     │     │  │  ├─ date_pb2.pyi
│     │     │  │  ├─ dayofweek.proto
│     │     │  │  ├─ dayofweek_pb2.py
│     │     │  │  ├─ dayofweek_pb2.pyi
│     │     │  │  ├─ decimal.proto
│     │     │  │  ├─ decimal_pb2.py
│     │     │  │  ├─ decimal_pb2.pyi
│     │     │  │  ├─ expr.proto
│     │     │  │  ├─ expr_pb2.py
│     │     │  │  ├─ expr_pb2.pyi
│     │     │  │  ├─ fraction.proto
│     │     │  │  ├─ fraction_pb2.py
│     │     │  │  ├─ fraction_pb2.pyi
│     │     │  │  ├─ interval.proto
│     │     │  │  ├─ interval_pb2.py
│     │     │  │  ├─ interval_pb2.pyi
│     │     │  │  ├─ latlng.proto
│     │     │  │  ├─ latlng_pb2.py
│     │     │  │  ├─ latlng_pb2.pyi
│     │     │  │  ├─ localized_text.proto
│     │     │  │  ├─ localized_text_pb2.py
│     │     │  │  ├─ localized_text_pb2.pyi
│     │     │  │  ├─ money.proto
│     │     │  │  ├─ money_pb2.py
│     │     │  │  ├─ money_pb2.pyi
│     │     │  │  ├─ month.proto
│     │     │  │  ├─ month_pb2.py
│     │     │  │  ├─ month_pb2.pyi
│     │     │  │  ├─ phone_number.proto
│     │     │  │  ├─ phone_number_pb2.py
│     │     │  │  ├─ phone_number_pb2.pyi
│     │     │  │  ├─ postal_address.proto
│     │     │  │  ├─ postal_address_pb2.py
│     │     │  │  ├─ postal_address_pb2.pyi
│     │     │  │  ├─ quaternion.proto
│     │     │  │  ├─ quaternion_pb2.py
│     │     │  │  ├─ quaternion_pb2.pyi
│     │     │  │  ├─ timeofday.proto
│     │     │  │  ├─ timeofday_pb2.py
│     │     │  │  └─ timeofday_pb2.pyi
│     │     │  ├─ _async_resumable_media
│     │     │  │  ├─ requests
│     │     │  │  │  ├─ download.py
│     │     │  │  │  ├─ upload.py
│     │     │  │  │  ├─ _request_helpers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ _download.py
│     │     │  │  ├─ _helpers.py
│     │     │  │  ├─ _upload.py
│     │     │  │  └─ __init__.py
│     │     │  └─ _upb
│     │     │     └─ _message.pyd
│     │     ├─ googleapiclient
│     │     │  ├─ channel.py
│     │     │  ├─ discovery.py
│     │     │  ├─ discovery_cache
│     │     │  │  ├─ appengine_memcache.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ documents
│     │     │  │  │  ├─ abusiveexperiencereport.v1.json
│     │     │  │  │  ├─ acceleratedmobilepageurl.v1.json
│     │     │  │  │  ├─ accessapproval.v1.json
│     │     │  │  │  ├─ accesscontextmanager.v1.json
│     │     │  │  │  ├─ accesscontextmanager.v1beta.json
│     │     │  │  │  ├─ acmedns.v1.json
│     │     │  │  │  ├─ addressvalidation.v1.json
│     │     │  │  │  ├─ adexchangebuyer.v1.2.json
│     │     │  │  │  ├─ adexchangebuyer.v1.3.json
│     │     │  │  │  ├─ adexchangebuyer.v1.4.json
│     │     │  │  │  ├─ adexchangebuyer2.v2beta1.json
│     │     │  │  │  ├─ adexperiencereport.v1.json
│     │     │  │  │  ├─ admin.datatransferv1.json
│     │     │  │  │  ├─ admin.datatransfer_v1.json
│     │     │  │  │  ├─ admin.directoryv1.json
│     │     │  │  │  ├─ admin.directory_v1.json
│     │     │  │  │  ├─ admin.reportsv1.json
│     │     │  │  │  ├─ admin.reports_v1.json
│     │     │  │  │  ├─ admob.v1.json
│     │     │  │  │  ├─ admob.v1beta.json
│     │     │  │  │  ├─ adsense.v2.json
│     │     │  │  │  ├─ adsensehost.v4.1.json
│     │     │  │  │  ├─ adsenseplatform.v1.json
│     │     │  │  │  ├─ adsenseplatform.v1alpha.json
│     │     │  │  │  ├─ advisorynotifications.v1.json
│     │     │  │  │  ├─ aiplatform.v1.json
│     │     │  │  │  ├─ aiplatform.v1beta1.json
│     │     │  │  │  ├─ airquality.v1.json
│     │     │  │  │  ├─ alertcenter.v1beta1.json
│     │     │  │  │  ├─ alloydb.v1.json
│     │     │  │  │  ├─ alloydb.v1alpha.json
│     │     │  │  │  ├─ alloydb.v1beta.json
│     │     │  │  │  ├─ analytics.v3.json
│     │     │  │  │  ├─ analyticsadmin.v1alpha.json
│     │     │  │  │  ├─ analyticsadmin.v1beta.json
│     │     │  │  │  ├─ analyticsdata.v1alpha.json
│     │     │  │  │  ├─ analyticsdata.v1beta.json
│     │     │  │  │  ├─ analyticshub.v1.json
│     │     │  │  │  ├─ analyticshub.v1beta1.json
│     │     │  │  │  ├─ analyticsreporting.v4.json
│     │     │  │  │  ├─ androiddeviceprovisioning.v1.json
│     │     │  │  │  ├─ androidenterprise.v1.json
│     │     │  │  │  ├─ androidmanagement.v1.json
│     │     │  │  │  ├─ androidpublisher.v3.json
│     │     │  │  │  ├─ apigateway.v1.json
│     │     │  │  │  ├─ apigateway.v1beta.json
│     │     │  │  │  ├─ apigee.v1.json
│     │     │  │  │  ├─ apigeeregistry.v1.json
│     │     │  │  │  ├─ apihub.v1.json
│     │     │  │  │  ├─ apikeys.v2.json
│     │     │  │  │  ├─ apim.v1alpha.json
│     │     │  │  │  ├─ appengine.v1.json
│     │     │  │  │  ├─ appengine.v1alpha.json
│     │     │  │  │  ├─ appengine.v1beta.json
│     │     │  │  │  ├─ appengine.v1beta4.json
│     │     │  │  │  ├─ appengine.v1beta5.json
│     │     │  │  │  ├─ apphub.v1.json
│     │     │  │  │  ├─ apphub.v1alpha.json
│     │     │  │  │  ├─ area120tables.v1alpha1.json
│     │     │  │  │  ├─ areainsights.v1.json
│     │     │  │  │  ├─ artifactregistry.v1.json
│     │     │  │  │  ├─ artifactregistry.v1beta1.json
│     │     │  │  │  ├─ artifactregistry.v1beta2.json
│     │     │  │  │  ├─ assuredworkloads.v1.json
│     │     │  │  │  ├─ assuredworkloads.v1beta1.json
│     │     │  │  │  ├─ authorizedbuyersmarketplace.v1.json
│     │     │  │  │  ├─ authorizedbuyersmarketplace.v1alpha.json
│     │     │  │  │  ├─ authorizedbuyersmarketplace.v1beta.json
│     │     │  │  │  ├─ backupdr.v1.json
│     │     │  │  │  ├─ baremetalsolution.v1.json
│     │     │  │  │  ├─ baremetalsolution.v1alpha1.json
│     │     │  │  │  ├─ baremetalsolution.v2.json
│     │     │  │  │  ├─ batch.v1.json
│     │     │  │  │  ├─ beyondcorp.v1.json
│     │     │  │  │  ├─ beyondcorp.v1alpha.json
│     │     │  │  │  ├─ biglake.v1.json
│     │     │  │  │  ├─ bigquery.v2.json
│     │     │  │  │  ├─ bigqueryconnection.v1.json
│     │     │  │  │  ├─ bigqueryconnection.v1beta1.json
│     │     │  │  │  ├─ bigquerydatapolicy.v1.json
│     │     │  │  │  ├─ bigquerydatapolicy.v2.json
│     │     │  │  │  ├─ bigquerydatatransfer.v1.json
│     │     │  │  │  ├─ bigqueryreservation.v1.json
│     │     │  │  │  ├─ bigqueryreservation.v1alpha2.json
│     │     │  │  │  ├─ bigqueryreservation.v1beta1.json
│     │     │  │  │  ├─ bigtableadmin.v1.json
│     │     │  │  │  ├─ bigtableadmin.v2.json
│     │     │  │  │  ├─ billingbudgets.v1.json
│     │     │  │  │  ├─ billingbudgets.v1beta1.json
│     │     │  │  │  ├─ binaryauthorization.v1.json
│     │     │  │  │  ├─ binaryauthorization.v1beta1.json
│     │     │  │  │  ├─ blockchainnodeengine.v1.json
│     │     │  │  │  ├─ blogger.v2.json
│     │     │  │  │  ├─ blogger.v3.json
│     │     │  │  │  ├─ books.v1.json
│     │     │  │  │  ├─ businessprofileperformance.v1.json
│     │     │  │  │  ├─ calendar.v3.json
│     │     │  │  │  ├─ certificatemanager.v1.json
│     │     │  │  │  ├─ chat.v1.json
│     │     │  │  │  ├─ checks.v1alpha.json
│     │     │  │  │  ├─ chromemanagement.v1.json
│     │     │  │  │  ├─ chromepolicy.v1.json
│     │     │  │  │  ├─ chromeuxreport.v1.json
│     │     │  │  │  ├─ chromewebstore.v1.1.json
│     │     │  │  │  ├─ chromewebstore.v2.json
│     │     │  │  │  ├─ civicinfo.v2.json
│     │     │  │  │  ├─ classroom.v1.json
│     │     │  │  │  ├─ cloudasset.v1.json
│     │     │  │  │  ├─ cloudasset.v1beta1.json
│     │     │  │  │  ├─ cloudasset.v1p1beta1.json
│     │     │  │  │  ├─ cloudasset.v1p4beta1.json
│     │     │  │  │  ├─ cloudasset.v1p5beta1.json
│     │     │  │  │  ├─ cloudasset.v1p7beta1.json
│     │     │  │  │  ├─ cloudbilling.v1.json
│     │     │  │  │  ├─ cloudbilling.v1beta.json
│     │     │  │  │  ├─ cloudbuild.v1.json
│     │     │  │  │  ├─ cloudbuild.v1alpha1.json
│     │     │  │  │  ├─ cloudbuild.v1alpha2.json
│     │     │  │  │  ├─ cloudbuild.v1beta1.json
│     │     │  │  │  ├─ cloudbuild.v2.json
│     │     │  │  │  ├─ cloudchannel.v1.json
│     │     │  │  │  ├─ cloudcommerceprocurement.v1.json
│     │     │  │  │  ├─ cloudcontrolspartner.v1.json
│     │     │  │  │  ├─ cloudcontrolspartner.v1beta.json
│     │     │  │  │  ├─ clouddebugger.v2.json
│     │     │  │  │  ├─ clouddeploy.v1.json
│     │     │  │  │  ├─ clouderrorreporting.v1beta1.json
│     │     │  │  │  ├─ cloudfunctions.v1.json
│     │     │  │  │  ├─ cloudfunctions.v2.json
│     │     │  │  │  ├─ cloudfunctions.v2alpha.json
│     │     │  │  │  ├─ cloudfunctions.v2beta.json
│     │     │  │  │  ├─ cloudidentity.v1.json
│     │     │  │  │  ├─ cloudidentity.v1beta1.json
│     │     │  │  │  ├─ cloudiot.v1.json
│     │     │  │  │  ├─ cloudkms.v1.json
│     │     │  │  │  ├─ cloudlocationfinder.v1.json
│     │     │  │  │  ├─ cloudlocationfinder.v1alpha.json
│     │     │  │  │  ├─ cloudprofiler.v2.json
│     │     │  │  │  ├─ cloudresourcemanager.v1.json
│     │     │  │  │  ├─ cloudresourcemanager.v1beta1.json
│     │     │  │  │  ├─ cloudresourcemanager.v2.json
│     │     │  │  │  ├─ cloudresourcemanager.v2beta1.json
│     │     │  │  │  ├─ cloudresourcemanager.v3.json
│     │     │  │  │  ├─ cloudscheduler.v1.json
│     │     │  │  │  ├─ cloudscheduler.v1beta1.json
│     │     │  │  │  ├─ cloudsearch.v1.json
│     │     │  │  │  ├─ cloudshell.v1.json
│     │     │  │  │  ├─ cloudshell.v1alpha1.json
│     │     │  │  │  ├─ cloudsupport.v2.json
│     │     │  │  │  ├─ cloudsupport.v2beta.json
│     │     │  │  │  ├─ cloudtasks.v2.json
│     │     │  │  │  ├─ cloudtasks.v2beta2.json
│     │     │  │  │  ├─ cloudtasks.v2beta3.json
│     │     │  │  │  ├─ cloudtrace.v1.json
│     │     │  │  │  ├─ cloudtrace.v2.json
│     │     │  │  │  ├─ cloudtrace.v2beta1.json
│     │     │  │  │  ├─ composer.v1.json
│     │     │  │  │  ├─ composer.v1beta1.json
│     │     │  │  │  ├─ compute.alpha.json
│     │     │  │  │  ├─ compute.beta.json
│     │     │  │  │  ├─ compute.v1.json
│     │     │  │  │  ├─ config.v1.json
│     │     │  │  │  ├─ connectors.v1.json
│     │     │  │  │  ├─ connectors.v2.json
│     │     │  │  │  ├─ contactcenteraiplatform.v1alpha1.json
│     │     │  │  │  ├─ contactcenterinsights.v1.json
│     │     │  │  │  ├─ container.v1.json
│     │     │  │  │  ├─ container.v1beta1.json
│     │     │  │  │  ├─ containeranalysis.v1.json
│     │     │  │  │  ├─ containeranalysis.v1alpha1.json
│     │     │  │  │  ├─ containeranalysis.v1beta1.json
│     │     │  │  │  ├─ content.v2.1.json
│     │     │  │  │  ├─ content.v2.json
│     │     │  │  │  ├─ contentwarehouse.v1.json
│     │     │  │  │  ├─ css.v1.json
│     │     │  │  │  ├─ customsearch.v1.json
│     │     │  │  │  ├─ datacatalog.v1.json
│     │     │  │  │  ├─ datacatalog.v1beta1.json
│     │     │  │  │  ├─ dataflow.v1b3.json
│     │     │  │  │  ├─ dataform.v1.json
│     │     │  │  │  ├─ dataform.v1beta1.json
│     │     │  │  │  ├─ datafusion.v1.json
│     │     │  │  │  ├─ datafusion.v1beta1.json
│     │     │  │  │  ├─ datalabeling.v1beta1.json
│     │     │  │  │  ├─ datalineage.v1.json
│     │     │  │  │  ├─ datamanager.v1.json
│     │     │  │  │  ├─ datamigration.v1.json
│     │     │  │  │  ├─ datamigration.v1beta1.json
│     │     │  │  │  ├─ datapipelines.v1.json
│     │     │  │  │  ├─ dataplex.v1.json
│     │     │  │  │  ├─ dataportability.v1.json
│     │     │  │  │  ├─ dataportability.v1beta.json
│     │     │  │  │  ├─ dataproc.v1.json
│     │     │  │  │  ├─ dataproc.v1beta2.json
│     │     │  │  │  ├─ datastore.v1.json
│     │     │  │  │  ├─ datastore.v1beta1.json
│     │     │  │  │  ├─ datastore.v1beta3.json
│     │     │  │  │  ├─ datastream.v1.json
│     │     │  │  │  ├─ datastream.v1alpha1.json
│     │     │  │  │  ├─ deploymentmanager.alpha.json
│     │     │  │  │  ├─ deploymentmanager.v2.json
│     │     │  │  │  ├─ deploymentmanager.v2beta.json
│     │     │  │  │  ├─ developerconnect.v1.json
│     │     │  │  │  ├─ dfareporting.v3.3.json
│     │     │  │  │  ├─ dfareporting.v3.4.json
│     │     │  │  │  ├─ dfareporting.v3.5.json
│     │     │  │  │  ├─ dfareporting.v4.json
│     │     │  │  │  ├─ dfareporting.v5.json
│     │     │  │  │  ├─ dialogflow.v2.json
│     │     │  │  │  ├─ dialogflow.v2beta1.json
│     │     │  │  │  ├─ dialogflow.v3.json
│     │     │  │  │  ├─ dialogflow.v3beta1.json
│     │     │  │  │  ├─ digitalassetlinks.v1.json
│     │     │  │  │  ├─ discovery.v1.json
│     │     │  │  │  ├─ discoveryengine.v1.json
│     │     │  │  │  ├─ discoveryengine.v1alpha.json
│     │     │  │  │  ├─ discoveryengine.v1beta.json
│     │     │  │  │  ├─ displayvideo.v1.json
│     │     │  │  │  ├─ displayvideo.v2.json
│     │     │  │  │  ├─ displayvideo.v3.json
│     │     │  │  │  ├─ displayvideo.v4.json
│     │     │  │  │  ├─ dlp.v2.json
│     │     │  │  │  ├─ dns.v1.json
│     │     │  │  │  ├─ dns.v1beta2.json
│     │     │  │  │  ├─ dns.v2.json
│     │     │  │  │  ├─ docs.v1.json
│     │     │  │  │  ├─ documentai.v1.json
│     │     │  │  │  ├─ documentai.v1beta2.json
│     │     │  │  │  ├─ documentai.v1beta3.json
│     │     │  │  │  ├─ domains.v1.json
│     │     │  │  │  ├─ domains.v1alpha2.json
│     │     │  │  │  ├─ domains.v1beta1.json
│     │     │  │  │  ├─ domainsrdap.v1.json
│     │     │  │  │  ├─ doubleclickbidmanager.v1.1.json
│     │     │  │  │  ├─ doubleclickbidmanager.v1.json
│     │     │  │  │  ├─ doubleclickbidmanager.v2.json
│     │     │  │  │  ├─ doubleclicksearch.v2.json
│     │     │  │  │  ├─ drive.v2.json
│     │     │  │  │  ├─ drive.v3.json
│     │     │  │  │  ├─ driveactivity.v2.json
│     │     │  │  │  ├─ drivelabels.v2.json
│     │     │  │  │  ├─ drivelabels.v2beta.json
│     │     │  │  │  ├─ essentialcontacts.v1.json
│     │     │  │  │  ├─ eventarc.v1.json
│     │     │  │  │  ├─ eventarc.v1beta1.json
│     │     │  │  │  ├─ factchecktools.v1alpha1.json
│     │     │  │  │  ├─ fcm.v1.json
│     │     │  │  │  ├─ fcmdata.v1beta1.json
│     │     │  │  │  ├─ file.v1.json
│     │     │  │  │  ├─ file.v1beta1.json
│     │     │  │  │  ├─ firebase.v1beta1.json
│     │     │  │  │  ├─ firebaseappcheck.v1.json
│     │     │  │  │  ├─ firebaseappcheck.v1beta.json
│     │     │  │  │  ├─ firebaseapphosting.v1.json
│     │     │  │  │  ├─ firebaseapphosting.v1beta.json
│     │     │  │  │  ├─ firebasedatabase.v1beta.json
│     │     │  │  │  ├─ firebasedataconnect.v1.json
│     │     │  │  │  ├─ firebasedataconnect.v1beta.json
│     │     │  │  │  ├─ firebasedynamiclinks.v1.json
│     │     │  │  │  ├─ firebasehosting.v1.json
│     │     │  │  │  ├─ firebasehosting.v1beta1.json
│     │     │  │  │  ├─ firebaseml.v1.json
│     │     │  │  │  ├─ firebaseml.v1beta2.json
│     │     │  │  │  ├─ firebaseml.v2beta.json
│     │     │  │  │  ├─ firebaserules.v1.json
│     │     │  │  │  ├─ firebasestorage.v1beta.json
│     │     │  │  │  ├─ firestore.v1.json
│     │     │  │  │  ├─ firestore.v1beta1.json
│     │     │  │  │  ├─ firestore.v1beta2.json
│     │     │  │  │  ├─ fitness.v1.json
│     │     │  │  │  ├─ forms.v1.json
│     │     │  │  │  ├─ games.v1.json
│     │     │  │  │  ├─ gamesConfiguration.v1configuration.json
│     │     │  │  │  ├─ gameservices.v1.json
│     │     │  │  │  ├─ gameservices.v1beta.json
│     │     │  │  │  ├─ gamesManagement.v1management.json
│     │     │  │  │  ├─ genomics.v1.json
│     │     │  │  │  ├─ genomics.v1alpha2.json
│     │     │  │  │  ├─ genomics.v2alpha1.json
│     │     │  │  │  ├─ gkebackup.v1.json
│     │     │  │  │  ├─ gkehub.v1.json
│     │     │  │  │  ├─ gkehub.v1alpha.json
│     │     │  │  │  ├─ gkehub.v1alpha2.json
│     │     │  │  │  ├─ gkehub.v1beta.json
│     │     │  │  │  ├─ gkehub.v1beta1.json
│     │     │  │  │  ├─ gkehub.v2.json
│     │     │  │  │  ├─ gkehub.v2alpha.json
│     │     │  │  │  ├─ gkehub.v2beta.json
│     │     │  │  │  ├─ gkeonprem.v1.json
│     │     │  │  │  ├─ gmail.v1.json
│     │     │  │  │  ├─ gmailpostmastertools.v1.json
│     │     │  │  │  ├─ gmailpostmastertools.v1beta1.json
│     │     │  │  │  ├─ groupsmigration.v1.json
│     │     │  │  │  ├─ groupssettings.v1.json
│     │     │  │  │  ├─ healthcare.v1.json
│     │     │  │  │  ├─ healthcare.v1beta1.json
│     │     │  │  │  ├─ homegraph.v1.json
│     │     │  │  │  ├─ iam.v1.json
│     │     │  │  │  ├─ iam.v2.json
│     │     │  │  │  ├─ iam.v2beta.json
│     │     │  │  │  ├─ iamcredentials.v1.json
│     │     │  │  │  ├─ iap.v1.json
│     │     │  │  │  ├─ iap.v1beta1.json
│     │     │  │  │  ├─ ideahub.v1alpha.json
│     │     │  │  │  ├─ ideahub.v1beta.json
│     │     │  │  │  ├─ identitytoolkit.v1.json
│     │     │  │  │  ├─ identitytoolkit.v2.json
│     │     │  │  │  ├─ identitytoolkit.v3.json
│     │     │  │  │  ├─ ids.v1.json
│     │     │  │  │  ├─ index.json
│     │     │  │  │  ├─ indexing.v3.json
│     │     │  │  │  ├─ integrations.v1.json
│     │     │  │  │  ├─ integrations.v1alpha.json
│     │     │  │  │  ├─ jobs.v2.json
│     │     │  │  │  ├─ jobs.v3.json
│     │     │  │  │  ├─ jobs.v3p1beta1.json
│     │     │  │  │  ├─ jobs.v4.json
│     │     │  │  │  ├─ keep.v1.json
│     │     │  │  │  ├─ kgsearch.v1.json
│     │     │  │  │  ├─ kmsinventory.v1.json
│     │     │  │  │  ├─ language.v1.json
│     │     │  │  │  ├─ language.v1beta1.json
│     │     │  │  │  ├─ language.v1beta2.json
│     │     │  │  │  ├─ language.v2.json
│     │     │  │  │  ├─ libraryagent.v1.json
│     │     │  │  │  ├─ licensing.v1.json
│     │     │  │  │  ├─ lifesciences.v2beta.json
│     │     │  │  │  ├─ localservices.v1.json
│     │     │  │  │  ├─ logging.v2.json
│     │     │  │  │  ├─ looker.v1.json
│     │     │  │  │  ├─ managedidentities.v1.json
│     │     │  │  │  ├─ managedidentities.v1alpha1.json
│     │     │  │  │  ├─ managedidentities.v1beta1.json
│     │     │  │  │  ├─ managedkafka.v1.json
│     │     │  │  │  ├─ manufacturers.v1.json
│     │     │  │  │  ├─ marketingplatformadmin.v1alpha.json
│     │     │  │  │  ├─ meet.v2.json
│     │     │  │  │  ├─ memcache.v1.json
│     │     │  │  │  ├─ memcache.v1beta2.json
│     │     │  │  │  ├─ merchantapi.accounts_v1.json
│     │     │  │  │  ├─ merchantapi.accounts_v1beta.json
│     │     │  │  │  ├─ merchantapi.conversions_v1.json
│     │     │  │  │  ├─ merchantapi.conversions_v1beta.json
│     │     │  │  │  ├─ merchantapi.datasources_v1.json
│     │     │  │  │  ├─ merchantapi.datasources_v1beta.json
│     │     │  │  │  ├─ merchantapi.inventories_v1.json
│     │     │  │  │  ├─ merchantapi.inventories_v1beta.json
│     │     │  │  │  ├─ merchantapi.issueresolution_v1.json
│     │     │  │  │  ├─ merchantapi.issueresolution_v1beta.json
│     │     │  │  │  ├─ merchantapi.lfp_v1.json
│     │     │  │  │  ├─ merchantapi.lfp_v1beta.json
│     │     │  │  │  ├─ merchantapi.notifications_v1.json
│     │     │  │  │  ├─ merchantapi.notifications_v1beta.json
│     │     │  │  │  ├─ merchantapi.ordertracking_v1.json
│     │     │  │  │  ├─ merchantapi.ordertracking_v1beta.json
│     │     │  │  │  ├─ merchantapi.products_v1.json
│     │     │  │  │  ├─ merchantapi.products_v1beta.json
│     │     │  │  │  ├─ merchantapi.promotions_v1.json
│     │     │  │  │  ├─ merchantapi.promotions_v1beta.json
│     │     │  │  │  ├─ merchantapi.quota_v1.json
│     │     │  │  │  ├─ merchantapi.quota_v1beta.json
│     │     │  │  │  ├─ merchantapi.reports_v1.json
│     │     │  │  │  ├─ merchantapi.reports_v1beta.json
│     │     │  │  │  ├─ merchantapi.reviews_v1beta.json
│     │     │  │  │  ├─ metastore.v1.json
│     │     │  │  │  ├─ metastore.v1alpha.json
│     │     │  │  │  ├─ metastore.v1beta.json
│     │     │  │  │  ├─ metastore.v2.json
│     │     │  │  │  ├─ metastore.v2alpha.json
│     │     │  │  │  ├─ metastore.v2beta.json
│     │     │  │  │  ├─ migrationcenter.v1.json
│     │     │  │  │  ├─ migrationcenter.v1alpha1.json
│     │     │  │  │  ├─ ml.v1.json
│     │     │  │  │  ├─ monitoring.v1.json
│     │     │  │  │  ├─ monitoring.v3.json
│     │     │  │  │  ├─ mybusinessaccountmanagement.v1.json
│     │     │  │  │  ├─ mybusinessbusinesscalls.v1.json
│     │     │  │  │  ├─ mybusinessbusinessinformation.v1.json
│     │     │  │  │  ├─ mybusinesslodging.v1.json
│     │     │  │  │  ├─ mybusinessnotifications.v1.json
│     │     │  │  │  ├─ mybusinessplaceactions.v1.json
│     │     │  │  │  ├─ mybusinessqanda.v1.json
│     │     │  │  │  ├─ mybusinessverifications.v1.json
│     │     │  │  │  ├─ netapp.v1.json
│     │     │  │  │  ├─ netapp.v1beta1.json
│     │     │  │  │  ├─ networkconnectivity.v1.json
│     │     │  │  │  ├─ networkconnectivity.v1alpha1.json
│     │     │  │  │  ├─ networkmanagement.v1.json
│     │     │  │  │  ├─ networkmanagement.v1beta1.json
│     │     │  │  │  ├─ networksecurity.v1.json
│     │     │  │  │  ├─ networksecurity.v1beta1.json
│     │     │  │  │  ├─ networkservices.v1.json
│     │     │  │  │  ├─ networkservices.v1beta1.json
│     │     │  │  │  ├─ notebooks.v1.json
│     │     │  │  │  ├─ notebooks.v2.json
│     │     │  │  │  ├─ oauth2.v2.json
│     │     │  │  │  ├─ observability.v1.json
│     │     │  │  │  ├─ ondemandscanning.v1.json
│     │     │  │  │  ├─ ondemandscanning.v1beta1.json
│     │     │  │  │  ├─ oracledatabase.v1.json
│     │     │  │  │  ├─ orgpolicy.v2.json
│     │     │  │  │  ├─ osconfig.v1.json
│     │     │  │  │  ├─ osconfig.v1alpha.json
│     │     │  │  │  ├─ osconfig.v1beta.json
│     │     │  │  │  ├─ osconfig.v2.json
│     │     │  │  │  ├─ osconfig.v2beta.json
│     │     │  │  │  ├─ oslogin.v1.json
│     │     │  │  │  ├─ oslogin.v1alpha.json
│     │     │  │  │  ├─ oslogin.v1beta.json
│     │     │  │  │  ├─ pagespeedonline.v5.json
│     │     │  │  │  ├─ parallelstore.v1.json
│     │     │  │  │  ├─ parallelstore.v1beta.json
│     │     │  │  │  ├─ parametermanager.v1.json
│     │     │  │  │  ├─ paymentsresellersubscription.v1.json
│     │     │  │  │  ├─ people.v1.json
│     │     │  │  │  ├─ places.v1.json
│     │     │  │  │  ├─ playablelocations.v3.json
│     │     │  │  │  ├─ playcustomapp.v1.json
│     │     │  │  │  ├─ playdeveloperreporting.v1alpha1.json
│     │     │  │  │  ├─ playdeveloperreporting.v1beta1.json
│     │     │  │  │  ├─ playgrouping.v1alpha1.json
│     │     │  │  │  ├─ playintegrity.v1.json
│     │     │  │  │  ├─ policyanalyzer.v1.json
│     │     │  │  │  ├─ policyanalyzer.v1beta1.json
│     │     │  │  │  ├─ policysimulator.v1.json
│     │     │  │  │  ├─ policysimulator.v1alpha.json
│     │     │  │  │  ├─ policysimulator.v1beta.json
│     │     │  │  │  ├─ policysimulator.v1beta1.json
│     │     │  │  │  ├─ policytroubleshooter.v1.json
│     │     │  │  │  ├─ policytroubleshooter.v1beta.json
│     │     │  │  │  ├─ pollen.v1.json
│     │     │  │  │  ├─ poly.v1.json
│     │     │  │  │  ├─ privateca.v1.json
│     │     │  │  │  ├─ privateca.v1beta1.json
│     │     │  │  │  ├─ prod_tt_sasportal.v1alpha1.json
│     │     │  │  │  ├─ publicca.v1.json
│     │     │  │  │  ├─ publicca.v1alpha1.json
│     │     │  │  │  ├─ publicca.v1beta1.json
│     │     │  │  │  ├─ pubsub.v1.json
│     │     │  │  │  ├─ pubsub.v1beta1a.json
│     │     │  │  │  ├─ pubsub.v1beta2.json
│     │     │  │  │  ├─ pubsublite.v1.json
│     │     │  │  │  ├─ rapidmigrationassessment.v1.json
│     │     │  │  │  ├─ readerrevenuesubscriptionlinking.v1.json
│     │     │  │  │  ├─ realtimebidding.v1.json
│     │     │  │  │  ├─ realtimebidding.v1alpha.json
│     │     │  │  │  ├─ recaptchaenterprise.v1.json
│     │     │  │  │  ├─ recommendationengine.v1beta1.json
│     │     │  │  │  ├─ recommender.v1.json
│     │     │  │  │  ├─ recommender.v1beta1.json
│     │     │  │  │  ├─ redis.v1.json
│     │     │  │  │  ├─ redis.v1beta1.json
│     │     │  │  │  ├─ remotebuildexecution.v1.json
│     │     │  │  │  ├─ remotebuildexecution.v1alpha.json
│     │     │  │  │  ├─ remotebuildexecution.v2.json
│     │     │  │  │  ├─ reseller.v1.json
│     │     │  │  │  ├─ resourcesettings.v1.json
│     │     │  │  │  ├─ retail.v2.json
│     │     │  │  │  ├─ retail.v2alpha.json
│     │     │  │  │  ├─ retail.v2beta.json
│     │     │  │  │  ├─ run.v1.json
│     │     │  │  │  ├─ run.v1alpha1.json
│     │     │  │  │  ├─ run.v1beta1.json
│     │     │  │  │  ├─ run.v2.json
│     │     │  │  │  ├─ runtimeconfig.v1.json
│     │     │  │  │  ├─ runtimeconfig.v1beta1.json
│     │     │  │  │  ├─ saasservicemgmt.v1beta1.json
│     │     │  │  │  ├─ safebrowsing.v4.json
│     │     │  │  │  ├─ safebrowsing.v5.json
│     │     │  │  │  ├─ sasportal.v1alpha1.json
│     │     │  │  │  ├─ script.v1.json
│     │     │  │  │  ├─ searchads360.v0.json
│     │     │  │  │  ├─ searchconsole.v1.json
│     │     │  │  │  ├─ secretmanager.v1.json
│     │     │  │  │  ├─ secretmanager.v1beta1.json
│     │     │  │  │  ├─ secretmanager.v1beta2.json
│     │     │  │  │  ├─ securesourcemanager.v1.json
│     │     │  │  │  ├─ securitycenter.v1.json
│     │     │  │  │  ├─ securitycenter.v1beta1.json
│     │     │  │  │  ├─ securitycenter.v1beta2.json
│     │     │  │  │  ├─ securityposture.v1.json
│     │     │  │  │  ├─ serviceconsumermanagement.v1.json
│     │     │  │  │  ├─ serviceconsumermanagement.v1beta1.json
│     │     │  │  │  ├─ servicecontrol.v1.json
│     │     │  │  │  ├─ servicecontrol.v2.json
│     │     │  │  │  ├─ servicedirectory.v1.json
│     │     │  │  │  ├─ servicedirectory.v1beta1.json
│     │     │  │  │  ├─ servicemanagement.v1.json
│     │     │  │  │  ├─ servicenetworking.v1.json
│     │     │  │  │  ├─ servicenetworking.v1beta.json
│     │     │  │  │  ├─ serviceusage.v1.json
│     │     │  │  │  ├─ serviceusage.v1beta1.json
│     │     │  │  │  ├─ sheets.v4.json
│     │     │  │  │  ├─ siteVerification.v1.json
│     │     │  │  │  ├─ slides.v1.json
│     │     │  │  │  ├─ smartdevicemanagement.v1.json
│     │     │  │  │  ├─ solar.v1.json
│     │     │  │  │  ├─ sourcerepo.v1.json
│     │     │  │  │  ├─ spanner.v1.json
│     │     │  │  │  ├─ speech.v1.json
│     │     │  │  │  ├─ speech.v1p1beta1.json
│     │     │  │  │  ├─ speech.v2beta1.json
│     │     │  │  │  ├─ sqladmin.v1.json
│     │     │  │  │  ├─ sqladmin.v1beta4.json
│     │     │  │  │  ├─ storage.v1.json
│     │     │  │  │  ├─ storagebatchoperations.v1.json
│     │     │  │  │  ├─ storagetransfer.v1.json
│     │     │  │  │  ├─ streetviewpublish.v1.json
│     │     │  │  │  ├─ sts.v1.json
│     │     │  │  │  ├─ sts.v1beta.json
│     │     │  │  │  ├─ tagmanager.v1.json
│     │     │  │  │  ├─ tagmanager.v2.json
│     │     │  │  │  ├─ tasks.v1.json
│     │     │  │  │  ├─ testing.v1.json
│     │     │  │  │  ├─ texttospeech.v1.json
│     │     │  │  │  ├─ texttospeech.v1beta1.json
│     │     │  │  │  ├─ toolresults.v1beta3.json
│     │     │  │  │  ├─ tpu.v1.json
│     │     │  │  │  ├─ tpu.v1alpha1.json
│     │     │  │  │  ├─ tpu.v2.json
│     │     │  │  │  ├─ tpu.v2alpha1.json
│     │     │  │  │  ├─ trafficdirector.v2.json
│     │     │  │  │  ├─ trafficdirector.v3.json
│     │     │  │  │  ├─ transcoder.v1.json
│     │     │  │  │  ├─ transcoder.v1beta1.json
│     │     │  │  │  ├─ translate.v2.json
│     │     │  │  │  ├─ translate.v3.json
│     │     │  │  │  ├─ translate.v3beta1.json
│     │     │  │  │  ├─ travelimpactmodel.v1.json
│     │     │  │  │  ├─ vault.v1.json
│     │     │  │  │  ├─ vectortile.v1.json
│     │     │  │  │  ├─ verifiedaccess.v1.json
│     │     │  │  │  ├─ verifiedaccess.v2.json
│     │     │  │  │  ├─ versionhistory.v1.json
│     │     │  │  │  ├─ videointelligence.v1.json
│     │     │  │  │  ├─ videointelligence.v1beta2.json
│     │     │  │  │  ├─ videointelligence.v1p1beta1.json
│     │     │  │  │  ├─ videointelligence.v1p2beta1.json
│     │     │  │  │  ├─ videointelligence.v1p3beta1.json
│     │     │  │  │  ├─ vision.v1.json
│     │     │  │  │  ├─ vision.v1p1beta1.json
│     │     │  │  │  ├─ vision.v1p2beta1.json
│     │     │  │  │  ├─ vmmigration.v1.json
│     │     │  │  │  ├─ vmmigration.v1alpha1.json
│     │     │  │  │  ├─ vmwareengine.v1.json
│     │     │  │  │  ├─ vpcaccess.v1.json
│     │     │  │  │  ├─ vpcaccess.v1beta1.json
│     │     │  │  │  ├─ walletobjects.v1.json
│     │     │  │  │  ├─ webfonts.v1.json
│     │     │  │  │  ├─ webmasters.v3.json
│     │     │  │  │  ├─ webrisk.v1.json
│     │     │  │  │  ├─ websecurityscanner.v1.json
│     │     │  │  │  ├─ websecurityscanner.v1alpha.json
│     │     │  │  │  ├─ websecurityscanner.v1beta.json
│     │     │  │  │  ├─ workflowexecutions.v1.json
│     │     │  │  │  ├─ workflowexecutions.v1beta.json
│     │     │  │  │  ├─ workflows.v1.json
│     │     │  │  │  ├─ workflows.v1beta.json
│     │     │  │  │  ├─ workloadmanager.v1.json
│     │     │  │  │  ├─ workspaceevents.v1.json
│     │     │  │  │  ├─ workstations.v1.json
│     │     │  │  │  ├─ workstations.v1beta.json
│     │     │  │  │  ├─ youtube.v3.json
│     │     │  │  │  ├─ youtubeAnalytics.v1.json
│     │     │  │  │  ├─ youtubeAnalytics.v2.json
│     │     │  │  │  └─ youtubereporting.v1.json
│     │     │  │  ├─ file_cache.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ errors.py
│     │     │  ├─ http.py
│     │     │  ├─ mimeparse.py
│     │     │  ├─ model.py
│     │     │  ├─ sample_tools.py
│     │     │  ├─ schema.py
│     │     │  ├─ version.py
│     │     │  ├─ _auth.py
│     │     │  ├─ _helpers.py
│     │     │  └─ __init__.py
│     │     ├─ googlesearch
│     │     │  ├─ user_agents.txt.gz
│     │     │  └─ __init__.py
│     │     ├─ google_auth_httplib2.py
│     │     ├─ google_auth_oauthlib
│     │     │  ├─ flow.py
│     │     │  ├─ helpers.py
│     │     │  ├─ interactive.py
│     │     │  ├─ tool
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  └─ __init__.py
│     │     ├─ google_crc32c
│     │     │  ├─ cext.py
│     │     │  ├─ extra-dll
│     │     │  │  └─ crc32c.dll
│     │     │  ├─ py.typed
│     │     │  ├─ python.py
│     │     │  ├─ _checksum.py
│     │     │  ├─ _crc32c.cp312-win_amd64.pyd
│     │     │  ├─ __config__.py
│     │     │  └─ __init__.py
│     │     ├─ gridfs
│     │     │  ├─ errors.py
│     │     │  ├─ grid_file.py
│     │     │  ├─ py.typed
│     │     │  └─ __init__.py
│     │     ├─ grpc
│     │     │  ├─ aio
│     │     │  │  ├─ _base_call.py
│     │     │  │  ├─ _base_channel.py
│     │     │  │  ├─ _base_server.py
│     │     │  │  ├─ _call.py
│     │     │  │  ├─ _channel.py
│     │     │  │  ├─ _interceptor.py
│     │     │  │  ├─ _metadata.py
│     │     │  │  ├─ _server.py
│     │     │  │  ├─ _typing.py
│     │     │  │  ├─ _utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ beta
│     │     │  │  ├─ implementations.py
│     │     │  │  ├─ interfaces.py
│     │     │  │  ├─ utilities.py
│     │     │  │  ├─ _client_adaptations.py
│     │     │  │  ├─ _metadata.py
│     │     │  │  ├─ _server_adaptations.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ experimental
│     │     │  │  ├─ aio
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ gevent.py
│     │     │  │  ├─ session_cache.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ framework
│     │     │  │  ├─ common
│     │     │  │  │  ├─ cardinality.py
│     │     │  │  │  ├─ style.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ foundation
│     │     │  │  │  ├─ abandonment.py
│     │     │  │  │  ├─ callable_util.py
│     │     │  │  │  ├─ future.py
│     │     │  │  │  ├─ logging_pool.py
│     │     │  │  │  ├─ stream.py
│     │     │  │  │  ├─ stream_util.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ interfaces
│     │     │  │  │  ├─ base
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ utilities.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ face
│     │     │  │  │  │  ├─ face.py
│     │     │  │  │  │  ├─ utilities.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _auth.py
│     │     │  ├─ _channel.py
│     │     │  ├─ _common.py
│     │     │  ├─ _compression.py
│     │     │  ├─ _cython
│     │     │  │  ├─ cygrpc.cp312-win_amd64.pyd
│     │     │  │  ├─ _credentials
│     │     │  │  │  └─ roots.pem
│     │     │  │  ├─ _cygrpc
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _grpcio_metadata.py
│     │     │  ├─ _interceptor.py
│     │     │  ├─ _observability.py
│     │     │  ├─ _plugin_wrapping.py
│     │     │  ├─ _runtime_protos.py
│     │     │  ├─ _server.py
│     │     │  ├─ _simple_stubs.py
│     │     │  ├─ _typing.py
│     │     │  ├─ _utilities.py
│     │     │  └─ __init__.py
│     │     ├─ grpc_status
│     │     │  ├─ rpc_status.py
│     │     │  ├─ _async.py
│     │     │  ├─ _common.py
│     │     │  └─ __init__.py
│     │     ├─ h11
│     │     │  ├─ py.typed
│     │     │  ├─ _abnf.py
│     │     │  ├─ _connection.py
│     │     │  ├─ _events.py
│     │     │  ├─ _headers.py
│     │     │  ├─ _readers.py
│     │     │  ├─ _receivebuffer.py
│     │     │  ├─ _state.py
│     │     │  ├─ _util.py
│     │     │  ├─ _version.py
│     │     │  ├─ _writers.py
│     │     │  └─ __init__.py
│     │     ├─ httpcore
│     │     │  ├─ py.typed
│     │     │  ├─ _api.py
│     │     │  ├─ _async
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ connection_pool.py
│     │     │  │  ├─ http11.py
│     │     │  │  ├─ http2.py
│     │     │  │  ├─ http_proxy.py
│     │     │  │  ├─ interfaces.py
│     │     │  │  ├─ socks_proxy.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _backends
│     │     │  │  ├─ anyio.py
│     │     │  │  ├─ auto.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ mock.py
│     │     │  │  ├─ sync.py
│     │     │  │  ├─ trio.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _exceptions.py
│     │     │  ├─ _models.py
│     │     │  ├─ _ssl.py
│     │     │  ├─ _sync
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ connection_pool.py
│     │     │  │  ├─ http11.py
│     │     │  │  ├─ http2.py
│     │     │  │  ├─ http_proxy.py
│     │     │  │  ├─ interfaces.py
│     │     │  │  ├─ socks_proxy.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _synchronization.py
│     │     │  ├─ _trace.py
│     │     │  ├─ _utils.py
│     │     │  └─ __init__.py
│     │     ├─ httplib2
│     │     │  ├─ auth.py
│     │     │  ├─ cacerts.txt
│     │     │  ├─ certs.py
│     │     │  ├─ error.py
│     │     │  ├─ iri2uri.py
│     │     │  └─ __init__.py
│     │     ├─ httptools
│     │     │  ├─ parser
│     │     │  │  ├─ cparser.pxd
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ parser.cp312-win_amd64.pyd
│     │     │  │  ├─ parser.pyi
│     │     │  │  ├─ parser.pyx
│     │     │  │  ├─ protocol.py
│     │     │  │  ├─ python.pxd
│     │     │  │  ├─ url_cparser.pxd
│     │     │  │  ├─ url_parser.cp312-win_amd64.pyd
│     │     │  │  ├─ url_parser.pyi
│     │     │  │  ├─ url_parser.pyx
│     │     │  │  └─ __init__.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ httpx
│     │     │  ├─ py.typed
│     │     │  ├─ _api.py
│     │     │  ├─ _auth.py
│     │     │  ├─ _client.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _config.py
│     │     │  ├─ _content.py
│     │     │  ├─ _decoders.py
│     │     │  ├─ _exceptions.py
│     │     │  ├─ _main.py
│     │     │  ├─ _models.py
│     │     │  ├─ _multipart.py
│     │     │  ├─ _status_codes.py
│     │     │  ├─ _transports
│     │     │  │  ├─ asgi.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ default.py
│     │     │  │  ├─ mock.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _types.py
│     │     │  ├─ _urlparse.py
│     │     │  ├─ _urls.py
│     │     │  ├─ _utils.py
│     │     │  ├─ __init__.py
│     │     │  └─ __version__.py
│     │     ├─ idna
│     │     │  ├─ codec.py
│     │     │  ├─ compat.py
│     │     │  ├─ core.py
│     │     │  ├─ idnadata.py
│     │     │  ├─ intranges.py
│     │     │  ├─ package_data.py
│     │     │  ├─ py.typed
│     │     │  ├─ uts46data.py
│     │     │  └─ __init__.py
│     │     ├─ itsdangerous
│     │     │  ├─ encoding.py
│     │     │  ├─ exc.py
│     │     │  ├─ py.typed
│     │     │  ├─ serializer.py
│     │     │  ├─ signer.py
│     │     │  ├─ timed.py
│     │     │  ├─ url_safe.py
│     │     │  ├─ _json.py
│     │     │  └─ __init__.py
│     │     ├─ jose
│     │     │  ├─ backends
│     │     │  │  ├─ base.py
│     │     │  │  ├─ cryptography_backend.py
│     │     │  │  ├─ ecdsa_backend.py
│     │     │  │  ├─ native.py
│     │     │  │  ├─ rsa_backend.py
│     │     │  │  ├─ _asn1.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ constants.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ jwe.py
│     │     │  ├─ jwk.py
│     │     │  ├─ jws.py
│     │     │  ├─ jwt.py
│     │     │  ├─ utils.py
│     │     │  └─ __init__.py
│     │     ├─ jwt
│     │     │  ├─ algorithms.py
│     │     │  ├─ api_jwk.py
│     │     │  ├─ api_jws.py
│     │     │  ├─ api_jwt.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ help.py
│     │     │  ├─ jwks_client.py
│     │     │  ├─ jwk_set_cache.py
│     │     │  ├─ py.typed
│     │     │  ├─ types.py
│     │     │  ├─ utils.py
│     │     │  ├─ warnings.py
│     │     │  └─ __init__.py
│     │     ├─ lazy_model
│     │     │  ├─ main.py
│     │     │  ├─ nao.py
│     │     │  ├─ parser
│     │     │  │  ├─ new.py
│     │     │  │  ├─ old.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ LICENSE
│     │     ├─ motor
│     │     │  ├─ aiohttp
│     │     │  │  └─ __init__.py
│     │     │  ├─ core.py
│     │     │  ├─ core.pyi
│     │     │  ├─ docstrings.py
│     │     │  ├─ frameworks
│     │     │  │  ├─ asyncio
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ tornado
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ metaprogramming.py
│     │     │  ├─ motor_asyncio.py
│     │     │  ├─ motor_common.py
│     │     │  ├─ motor_gridfs.py
│     │     │  ├─ motor_gridfs.pyi
│     │     │  ├─ motor_tornado.py
│     │     │  ├─ py.typed
│     │     │  ├─ web.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ msgpack
│     │     │  ├─ exceptions.py
│     │     │  ├─ ext.py
│     │     │  ├─ fallback.py
│     │     │  ├─ _cmsgpack.cp312-win_amd64.pyd
│     │     │  └─ __init__.py
│     │     ├─ multidict
│     │     │  ├─ py.typed
│     │     │  ├─ _abc.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _multidict.cp312-win_amd64.pyd
│     │     │  ├─ _multidict_py.py
│     │     │  └─ __init__.py
│     │     ├─ multipart
│     │     │  ├─ decoders.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ multipart.py
│     │     │  ├─ tests
│     │     │  │  ├─ compat.py
│     │     │  │  ├─ test_data
│     │     │  │  │  └─ http
│     │     │  │  │     ├─ almost_match_boundary.http
│     │     │  │  │     ├─ almost_match_boundary.yaml
│     │     │  │  │     ├─ almost_match_boundary_without_CR.http
│     │     │  │  │     ├─ almost_match_boundary_without_CR.yaml
│     │     │  │  │     ├─ almost_match_boundary_without_final_hyphen.http
│     │     │  │  │     ├─ almost_match_boundary_without_final_hyphen.yaml
│     │     │  │  │     ├─ almost_match_boundary_without_LF.http
│     │     │  │  │     ├─ almost_match_boundary_without_LF.yaml
│     │     │  │  │     ├─ bad_end_of_headers.http
│     │     │  │  │     ├─ bad_end_of_headers.yaml
│     │     │  │  │     ├─ bad_header_char.http
│     │     │  │  │     ├─ bad_header_char.yaml
│     │     │  │  │     ├─ bad_initial_boundary.http
│     │     │  │  │     ├─ bad_initial_boundary.yaml
│     │     │  │  │     ├─ base64_encoding.http
│     │     │  │  │     ├─ base64_encoding.yaml
│     │     │  │  │     ├─ CR_in_header.http
│     │     │  │  │     ├─ CR_in_header.yaml
│     │     │  │  │     ├─ CR_in_header_value.http
│     │     │  │  │     ├─ CR_in_header_value.yaml
│     │     │  │  │     ├─ empty_header.http
│     │     │  │  │     ├─ empty_header.yaml
│     │     │  │  │     ├─ multiple_fields.http
│     │     │  │  │     ├─ multiple_fields.yaml
│     │     │  │  │     ├─ multiple_files.http
│     │     │  │  │     ├─ multiple_files.yaml
│     │     │  │  │     ├─ quoted_printable_encoding.http
│     │     │  │  │     ├─ quoted_printable_encoding.yaml
│     │     │  │  │     ├─ single_field.http
│     │     │  │  │     ├─ single_field.yaml
│     │     │  │  │     ├─ single_field_blocks.http
│     │     │  │  │     ├─ single_field_blocks.yaml
│     │     │  │  │     ├─ single_field_longer.http
│     │     │  │  │     ├─ single_field_longer.yaml
│     │     │  │  │     ├─ single_field_single_file.http
│     │     │  │  │     ├─ single_field_single_file.yaml
│     │     │  │  │     ├─ single_field_with_leading_newlines.http
│     │     │  │  │     ├─ single_field_with_leading_newlines.yaml
│     │     │  │  │     ├─ single_file.http
│     │     │  │  │     ├─ single_file.yaml
│     │     │  │  │     ├─ utf8_filename.http
│     │     │  │  │     └─ utf8_filename.yaml
│     │     │  │  ├─ test_multipart.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ oauthlib
│     │     │  ├─ common.py
│     │     │  ├─ oauth1
│     │     │  │  ├─ rfc5849
│     │     │  │  │  ├─ endpoints
│     │     │  │  │  │  ├─ access_token.py
│     │     │  │  │  │  ├─ authorization.py
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ pre_configured.py
│     │     │  │  │  │  ├─ request_token.py
│     │     │  │  │  │  ├─ resource.py
│     │     │  │  │  │  ├─ signature_only.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ parameters.py
│     │     │  │  │  ├─ request_validator.py
│     │     │  │  │  ├─ signature.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ oauth2
│     │     │  │  ├─ rfc6749
│     │     │  │  │  ├─ clients
│     │     │  │  │  │  ├─ backend_application.py
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ legacy_application.py
│     │     │  │  │  │  ├─ mobile_application.py
│     │     │  │  │  │  ├─ service_application.py
│     │     │  │  │  │  ├─ web_application.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ endpoints
│     │     │  │  │  │  ├─ authorization.py
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ introspect.py
│     │     │  │  │  │  ├─ metadata.py
│     │     │  │  │  │  ├─ pre_configured.py
│     │     │  │  │  │  ├─ resource.py
│     │     │  │  │  │  ├─ revocation.py
│     │     │  │  │  │  ├─ token.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ grant_types
│     │     │  │  │  │  ├─ authorization_code.py
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ client_credentials.py
│     │     │  │  │  │  ├─ implicit.py
│     │     │  │  │  │  ├─ refresh_token.py
│     │     │  │  │  │  ├─ resource_owner_password_credentials.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ parameters.py
│     │     │  │  │  ├─ request_validator.py
│     │     │  │  │  ├─ tokens.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rfc8628
│     │     │  │  │  ├─ clients
│     │     │  │  │  │  ├─ device.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ endpoints
│     │     │  │  │  │  ├─ device_authorization.py
│     │     │  │  │  │  ├─ pre_configured.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ grant_types
│     │     │  │  │  │  ├─ device_code.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ request_validator.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ openid
│     │     │  │  ├─ connect
│     │     │  │  │  ├─ core
│     │     │  │  │  │  ├─ endpoints
│     │     │  │  │  │  │  ├─ pre_configured.py
│     │     │  │  │  │  │  ├─ userinfo.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ exceptions.py
│     │     │  │  │  │  ├─ grant_types
│     │     │  │  │  │  │  ├─ authorization_code.py
│     │     │  │  │  │  │  ├─ base.py
│     │     │  │  │  │  │  ├─ dispatchers.py
│     │     │  │  │  │  │  ├─ hybrid.py
│     │     │  │  │  │  │  ├─ implicit.py
│     │     │  │  │  │  │  ├─ refresh_token.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ request_validator.py
│     │     │  │  │  │  ├─ tokens.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ signals.py
│     │     │  ├─ uri_validate.py
│     │     │  └─ __init__.py
│     │     ├─ OpenSSL
│     │     │  ├─ crypto.py
│     │     │  ├─ debug.py
│     │     │  ├─ py.typed
│     │     │  ├─ rand.py
│     │     │  ├─ SSL.py
│     │     │  ├─ version.py
│     │     │  ├─ _util.py
│     │     │  └─ __init__.py
│     │     ├─ passlib
│     │     │  ├─ apache.py
│     │     │  ├─ apps.py
│     │     │  ├─ context.py
│     │     │  ├─ crypto
│     │     │  │  ├─ des.py
│     │     │  │  ├─ digest.py
│     │     │  │  ├─ scrypt
│     │     │  │  │  ├─ _builtin.py
│     │     │  │  │  ├─ _gen_files.py
│     │     │  │  │  ├─ _salsa.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ _blowfish
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ unrolled.py
│     │     │  │  │  ├─ _gen_files.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ _md4.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ exc.py
│     │     │  ├─ ext
│     │     │  │  ├─ django
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ handlers
│     │     │  │  ├─ argon2.py
│     │     │  │  ├─ bcrypt.py
│     │     │  │  ├─ cisco.py
│     │     │  │  ├─ des_crypt.py
│     │     │  │  ├─ digests.py
│     │     │  │  ├─ django.py
│     │     │  │  ├─ fshp.py
│     │     │  │  ├─ ldap_digests.py
│     │     │  │  ├─ md5_crypt.py
│     │     │  │  ├─ misc.py
│     │     │  │  ├─ mssql.py
│     │     │  │  ├─ mysql.py
│     │     │  │  ├─ oracle.py
│     │     │  │  ├─ pbkdf2.py
│     │     │  │  ├─ phpass.py
│     │     │  │  ├─ postgres.py
│     │     │  │  ├─ roundup.py
│     │     │  │  ├─ scram.py
│     │     │  │  ├─ scrypt.py
│     │     │  │  ├─ sha1_crypt.py
│     │     │  │  ├─ sha2_crypt.py
│     │     │  │  ├─ sun_md5_crypt.py
│     │     │  │  ├─ windows.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ hash.py
│     │     │  ├─ hosts.py
│     │     │  ├─ ifc.py
│     │     │  ├─ pwd.py
│     │     │  ├─ registry.py
│     │     │  ├─ tests
│     │     │  │  ├─ backports.py
│     │     │  │  ├─ sample1.cfg
│     │     │  │  ├─ sample1b.cfg
│     │     │  │  ├─ sample1c.cfg
│     │     │  │  ├─ sample_config_1s.cfg
│     │     │  │  ├─ test_apache.py
│     │     │  │  ├─ test_apps.py
│     │     │  │  ├─ test_context.py
│     │     │  │  ├─ test_context_deprecated.py
│     │     │  │  ├─ test_crypto_builtin_md4.py
│     │     │  │  ├─ test_crypto_des.py
│     │     │  │  ├─ test_crypto_digest.py
│     │     │  │  ├─ test_crypto_scrypt.py
│     │     │  │  ├─ test_ext_django.py
│     │     │  │  ├─ test_ext_django_source.py
│     │     │  │  ├─ test_handlers.py
│     │     │  │  ├─ test_handlers_argon2.py
│     │     │  │  ├─ test_handlers_bcrypt.py
│     │     │  │  ├─ test_handlers_cisco.py
│     │     │  │  ├─ test_handlers_django.py
│     │     │  │  ├─ test_handlers_pbkdf2.py
│     │     │  │  ├─ test_handlers_scrypt.py
│     │     │  │  ├─ test_hosts.py
│     │     │  │  ├─ test_pwd.py
│     │     │  │  ├─ test_registry.py
│     │     │  │  ├─ test_totp.py
│     │     │  │  ├─ test_utils.py
│     │     │  │  ├─ test_utils_handlers.py
│     │     │  │  ├─ test_utils_md4.py
│     │     │  │  ├─ test_utils_pbkdf2.py
│     │     │  │  ├─ test_win32.py
│     │     │  │  ├─ tox_support.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ _test_bad_register.py
│     │     │  │  ├─ __init__.py
│     │     │  │  └─ __main__.py
│     │     │  ├─ totp.py
│     │     │  ├─ utils
│     │     │  │  ├─ binary.py
│     │     │  │  ├─ compat
│     │     │  │  │  ├─ _ordered_dict.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ decor.py
│     │     │  │  ├─ des.py
│     │     │  │  ├─ handlers.py
│     │     │  │  ├─ md4.py
│     │     │  │  ├─ pbkdf2.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ win32.py
│     │     │  ├─ _data
│     │     │  │  └─ wordsets
│     │     │  │     ├─ bip39.txt
│     │     │  │     ├─ eff_long.txt
│     │     │  │     ├─ eff_prefixed.txt
│     │     │  │     └─ eff_short.txt
│     │     │  └─ __init__.py
│     │     ├─ PIL
│     │     │  ├─ BdfFontFile.py
│     │     │  ├─ BlpImagePlugin.py
│     │     │  ├─ BmpImagePlugin.py
│     │     │  ├─ BufrStubImagePlugin.py
│     │     │  ├─ ContainerIO.py
│     │     │  ├─ CurImagePlugin.py
│     │     │  ├─ DcxImagePlugin.py
│     │     │  ├─ DdsImagePlugin.py
│     │     │  ├─ EpsImagePlugin.py
│     │     │  ├─ ExifTags.py
│     │     │  ├─ features.py
│     │     │  ├─ FitsImagePlugin.py
│     │     │  ├─ FliImagePlugin.py
│     │     │  ├─ FontFile.py
│     │     │  ├─ FpxImagePlugin.py
│     │     │  ├─ FtexImagePlugin.py
│     │     │  ├─ GbrImagePlugin.py
│     │     │  ├─ GdImageFile.py
│     │     │  ├─ GifImagePlugin.py
│     │     │  ├─ GimpGradientFile.py
│     │     │  ├─ GimpPaletteFile.py
│     │     │  ├─ GribStubImagePlugin.py
│     │     │  ├─ Hdf5StubImagePlugin.py
│     │     │  ├─ IcnsImagePlugin.py
│     │     │  ├─ IcoImagePlugin.py
│     │     │  ├─ Image.py
│     │     │  ├─ ImageChops.py
│     │     │  ├─ ImageCms.py
│     │     │  ├─ ImageColor.py
│     │     │  ├─ ImageDraw.py
│     │     │  ├─ ImageDraw2.py
│     │     │  ├─ ImageEnhance.py
│     │     │  ├─ ImageFile.py
│     │     │  ├─ ImageFilter.py
│     │     │  ├─ ImageFont.py
│     │     │  ├─ ImageGrab.py
│     │     │  ├─ ImageMath.py
│     │     │  ├─ ImageMode.py
│     │     │  ├─ ImageMorph.py
│     │     │  ├─ ImageOps.py
│     │     │  ├─ ImagePalette.py
│     │     │  ├─ ImagePath.py
│     │     │  ├─ ImageQt.py
│     │     │  ├─ ImageSequence.py
│     │     │  ├─ ImageShow.py
│     │     │  ├─ ImageStat.py
│     │     │  ├─ ImageTk.py
│     │     │  ├─ ImageTransform.py
│     │     │  ├─ ImageWin.py
│     │     │  ├─ ImImagePlugin.py
│     │     │  ├─ ImtImagePlugin.py
│     │     │  ├─ IptcImagePlugin.py
│     │     │  ├─ Jpeg2KImagePlugin.py
│     │     │  ├─ JpegImagePlugin.py
│     │     │  ├─ JpegPresets.py
│     │     │  ├─ McIdasImagePlugin.py
│     │     │  ├─ MicImagePlugin.py
│     │     │  ├─ MpegImagePlugin.py
│     │     │  ├─ MpoImagePlugin.py
│     │     │  ├─ MspImagePlugin.py
│     │     │  ├─ PaletteFile.py
│     │     │  ├─ PalmImagePlugin.py
│     │     │  ├─ PcdImagePlugin.py
│     │     │  ├─ PcfFontFile.py
│     │     │  ├─ PcxImagePlugin.py
│     │     │  ├─ PdfImagePlugin.py
│     │     │  ├─ PdfParser.py
│     │     │  ├─ PixarImagePlugin.py
│     │     │  ├─ PngImagePlugin.py
│     │     │  ├─ PpmImagePlugin.py
│     │     │  ├─ PsdImagePlugin.py
│     │     │  ├─ PSDraw.py
│     │     │  ├─ PyAccess.py
│     │     │  ├─ QoiImagePlugin.py
│     │     │  ├─ SgiImagePlugin.py
│     │     │  ├─ SpiderImagePlugin.py
│     │     │  ├─ SunImagePlugin.py
│     │     │  ├─ TarIO.py
│     │     │  ├─ TgaImagePlugin.py
│     │     │  ├─ TiffImagePlugin.py
│     │     │  ├─ TiffTags.py
│     │     │  ├─ WalImageFile.py
│     │     │  ├─ WebPImagePlugin.py
│     │     │  ├─ WmfImagePlugin.py
│     │     │  ├─ XbmImagePlugin.py
│     │     │  ├─ XpmImagePlugin.py
│     │     │  ├─ XVThumbImagePlugin.py
│     │     │  ├─ _binary.py
│     │     │  ├─ _deprecate.py
│     │     │  ├─ _imaging.cp312-win_amd64.pyd
│     │     │  ├─ _imagingcms.cp312-win_amd64.pyd
│     │     │  ├─ _imagingft.cp312-win_amd64.pyd
│     │     │  ├─ _imagingmath.cp312-win_amd64.pyd
│     │     │  ├─ _imagingmorph.cp312-win_amd64.pyd
│     │     │  ├─ _imagingtk.cp312-win_amd64.pyd
│     │     │  ├─ _tkinter_finder.py
│     │     │  ├─ _util.py
│     │     │  ├─ _version.py
│     │     │  ├─ _webp.cp312-win_amd64.pyd
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ pip
│     │     │  ├─ py.typed
│     │     │  ├─ _internal
│     │     │  │  ├─ build_env.py
│     │     │  │  ├─ cache.py
│     │     │  │  ├─ cli
│     │     │  │  │  ├─ autocompletion.py
│     │     │  │  │  ├─ base_command.py
│     │     │  │  │  ├─ cmdoptions.py
│     │     │  │  │  ├─ command_context.py
│     │     │  │  │  ├─ index_command.py
│     │     │  │  │  ├─ main.py
│     │     │  │  │  ├─ main_parser.py
│     │     │  │  │  ├─ parser.py
│     │     │  │  │  ├─ progress_bars.py
│     │     │  │  │  ├─ req_command.py
│     │     │  │  │  ├─ spinners.py
│     │     │  │  │  ├─ status_codes.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ commands
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ check.py
│     │     │  │  │  ├─ completion.py
│     │     │  │  │  ├─ configuration.py
│     │     │  │  │  ├─ debug.py
│     │     │  │  │  ├─ download.py
│     │     │  │  │  ├─ freeze.py
│     │     │  │  │  ├─ hash.py
│     │     │  │  │  ├─ help.py
│     │     │  │  │  ├─ index.py
│     │     │  │  │  ├─ inspect.py
│     │     │  │  │  ├─ install.py
│     │     │  │  │  ├─ list.py
│     │     │  │  │  ├─ lock.py
│     │     │  │  │  ├─ search.py
│     │     │  │  │  ├─ show.py
│     │     │  │  │  ├─ uninstall.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ configuration.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ index
│     │     │  │  │  ├─ collector.py
│     │     │  │  │  ├─ package_finder.py
│     │     │  │  │  ├─ sources.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ locations
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ _sysconfig.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ main.py
│     │     │  │  ├─ metadata
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ importlib
│     │     │  │  │  │  ├─ _compat.py
│     │     │  │  │  │  ├─ _envs.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ pkg_resources.py
│     │     │  │  │  ├─ _json.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ models
│     │     │  │  │  ├─ candidate.py
│     │     │  │  │  ├─ direct_url.py
│     │     │  │  │  ├─ format_control.py
│     │     │  │  │  ├─ index.py
│     │     │  │  │  ├─ installation_report.py
│     │     │  │  │  ├─ link.py
│     │     │  │  │  ├─ pylock.py
│     │     │  │  │  ├─ scheme.py
│     │     │  │  │  ├─ search_scope.py
│     │     │  │  │  ├─ selection_prefs.py
│     │     │  │  │  ├─ target_python.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ network
│     │     │  │  │  ├─ auth.py
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ download.py
│     │     │  │  │  ├─ lazy_wheel.py
│     │     │  │  │  ├─ session.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ xmlrpc.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ operations
│     │     │  │  │  ├─ build
│     │     │  │  │  │  ├─ build_tracker.py
│     │     │  │  │  │  ├─ metadata.py
│     │     │  │  │  │  ├─ metadata_editable.py
│     │     │  │  │  │  ├─ wheel.py
│     │     │  │  │  │  ├─ wheel_editable.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ check.py
│     │     │  │  │  ├─ freeze.py
│     │     │  │  │  ├─ install
│     │     │  │  │  │  ├─ wheel.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ prepare.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ pyproject.py
│     │     │  │  ├─ req
│     │     │  │  │  ├─ constructors.py
│     │     │  │  │  ├─ req_dependency_group.py
│     │     │  │  │  ├─ req_file.py
│     │     │  │  │  ├─ req_install.py
│     │     │  │  │  ├─ req_set.py
│     │     │  │  │  ├─ req_uninstall.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ resolution
│     │     │  │  │  ├─ base.py
│     │     │  │  │  ├─ legacy
│     │     │  │  │  │  ├─ resolver.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ resolvelib
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ candidates.py
│     │     │  │  │  │  ├─ factory.py
│     │     │  │  │  │  ├─ found_candidates.py
│     │     │  │  │  │  ├─ provider.py
│     │     │  │  │  │  ├─ reporter.py
│     │     │  │  │  │  ├─ requirements.py
│     │     │  │  │  │  ├─ resolver.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ self_outdated_check.py
│     │     │  │  ├─ utils
│     │     │  │  │  ├─ appdirs.py
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ compatibility_tags.py
│     │     │  │  │  ├─ datetime.py
│     │     │  │  │  ├─ deprecation.py
│     │     │  │  │  ├─ direct_url_helpers.py
│     │     │  │  │  ├─ egg_link.py
│     │     │  │  │  ├─ entrypoints.py
│     │     │  │  │  ├─ filesystem.py
│     │     │  │  │  ├─ filetypes.py
│     │     │  │  │  ├─ glibc.py
│     │     │  │  │  ├─ hashes.py
│     │     │  │  │  ├─ logging.py
│     │     │  │  │  ├─ misc.py
│     │     │  │  │  ├─ packaging.py
│     │     │  │  │  ├─ retry.py
│     │     │  │  │  ├─ subprocess.py
│     │     │  │  │  ├─ temp_dir.py
│     │     │  │  │  ├─ unpacking.py
│     │     │  │  │  ├─ urls.py
│     │     │  │  │  ├─ virtualenv.py
│     │     │  │  │  ├─ wheel.py
│     │     │  │  │  ├─ _jaraco_text.py
│     │     │  │  │  ├─ _log.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ vcs
│     │     │  │  │  ├─ bazaar.py
│     │     │  │  │  ├─ git.py
│     │     │  │  │  ├─ mercurial.py
│     │     │  │  │  ├─ subversion.py
│     │     │  │  │  ├─ versioncontrol.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ wheel_builder.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _vendor
│     │     │  │  ├─ cachecontrol
│     │     │  │  │  ├─ adapter.py
│     │     │  │  │  ├─ cache.py
│     │     │  │  │  ├─ caches
│     │     │  │  │  │  ├─ file_cache.py
│     │     │  │  │  │  ├─ redis_cache.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ controller.py
│     │     │  │  │  ├─ filewrapper.py
│     │     │  │  │  ├─ heuristics.py
│     │     │  │  │  ├─ LICENSE.txt
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ serialize.py
│     │     │  │  │  ├─ wrapper.py
│     │     │  │  │  ├─ _cmd.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ certifi
│     │     │  │  │  ├─ cacert.pem
│     │     │  │  │  ├─ core.py
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ dependency_groups
│     │     │  │  │  ├─ LICENSE.txt
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _implementation.py
│     │     │  │  │  ├─ _lint_dependency_groups.py
│     │     │  │  │  ├─ _pip_wrapper.py
│     │     │  │  │  ├─ _toml_compat.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ idna
│     │     │  │  │  ├─ codec.py
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ core.py
│     │     │  │  │  ├─ idnadata.py
│     │     │  │  │  ├─ intranges.py
│     │     │  │  │  ├─ LICENSE.md
│     │     │  │  │  ├─ package_data.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ uts46data.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ msgpack
│     │     │  │  │  ├─ COPYING
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ ext.py
│     │     │  │  │  ├─ fallback.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ packaging
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ LICENSE.APACHE
│     │     │  │  │  ├─ LICENSE.BSD
│     │     │  │  │  ├─ licenses
│     │     │  │  │  │  ├─ _spdx.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ markers.py
│     │     │  │  │  ├─ metadata.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ requirements.py
│     │     │  │  │  ├─ specifiers.py
│     │     │  │  │  ├─ tags.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ _elffile.py
│     │     │  │  │  ├─ _manylinux.py
│     │     │  │  │  ├─ _musllinux.py
│     │     │  │  │  ├─ _parser.py
│     │     │  │  │  ├─ _structures.py
│     │     │  │  │  ├─ _tokenizer.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ pkg_resources
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ platformdirs
│     │     │  │  │  ├─ android.py
│     │     │  │  │  ├─ api.py
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ macos.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ unix.py
│     │     │  │  │  ├─ version.py
│     │     │  │  │  ├─ windows.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ pygments
│     │     │  │  │  ├─ console.py
│     │     │  │  │  ├─ filter.py
│     │     │  │  │  ├─ filters
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ formatter.py
│     │     │  │  │  ├─ formatters
│     │     │  │  │  │  ├─ _mapping.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ lexer.py
│     │     │  │  │  ├─ lexers
│     │     │  │  │  │  ├─ python.py
│     │     │  │  │  │  ├─ _mapping.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ modeline.py
│     │     │  │  │  ├─ plugin.py
│     │     │  │  │  ├─ regexopt.py
│     │     │  │  │  ├─ scanner.py
│     │     │  │  │  ├─ sphinxext.py
│     │     │  │  │  ├─ style.py
│     │     │  │  │  ├─ styles
│     │     │  │  │  │  ├─ _mapping.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ token.py
│     │     │  │  │  ├─ unistring.py
│     │     │  │  │  ├─ util.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ pyproject_hooks
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _impl.py
│     │     │  │  │  ├─ _in_process
│     │     │  │  │  │  ├─ _in_process.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ README.rst
│     │     │  │  ├─ requests
│     │     │  │  │  ├─ adapters.py
│     │     │  │  │  ├─ api.py
│     │     │  │  │  ├─ auth.py
│     │     │  │  │  ├─ certs.py
│     │     │  │  │  ├─ compat.py
│     │     │  │  │  ├─ cookies.py
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ help.py
│     │     │  │  │  ├─ hooks.py
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ models.py
│     │     │  │  │  ├─ packages.py
│     │     │  │  │  ├─ sessions.py
│     │     │  │  │  ├─ status_codes.py
│     │     │  │  │  ├─ structures.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  ├─ _internal_utils.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __version__.py
│     │     │  │  ├─ resolvelib
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ providers.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ reporters.py
│     │     │  │  │  ├─ resolvers
│     │     │  │  │  │  ├─ abstract.py
│     │     │  │  │  │  ├─ criterion.py
│     │     │  │  │  │  ├─ exceptions.py
│     │     │  │  │  │  ├─ resolution.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ structs.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ rich
│     │     │  │  │  ├─ abc.py
│     │     │  │  │  ├─ align.py
│     │     │  │  │  ├─ ansi.py
│     │     │  │  │  ├─ bar.py
│     │     │  │  │  ├─ box.py
│     │     │  │  │  ├─ cells.py
│     │     │  │  │  ├─ color.py
│     │     │  │  │  ├─ color_triplet.py
│     │     │  │  │  ├─ columns.py
│     │     │  │  │  ├─ console.py
│     │     │  │  │  ├─ constrain.py
│     │     │  │  │  ├─ containers.py
│     │     │  │  │  ├─ control.py
│     │     │  │  │  ├─ default_styles.py
│     │     │  │  │  ├─ diagnose.py
│     │     │  │  │  ├─ emoji.py
│     │     │  │  │  ├─ errors.py
│     │     │  │  │  ├─ filesize.py
│     │     │  │  │  ├─ file_proxy.py
│     │     │  │  │  ├─ highlighter.py
│     │     │  │  │  ├─ json.py
│     │     │  │  │  ├─ jupyter.py
│     │     │  │  │  ├─ layout.py
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ live.py
│     │     │  │  │  ├─ live_render.py
│     │     │  │  │  ├─ logging.py
│     │     │  │  │  ├─ markup.py
│     │     │  │  │  ├─ measure.py
│     │     │  │  │  ├─ padding.py
│     │     │  │  │  ├─ pager.py
│     │     │  │  │  ├─ palette.py
│     │     │  │  │  ├─ panel.py
│     │     │  │  │  ├─ pretty.py
│     │     │  │  │  ├─ progress.py
│     │     │  │  │  ├─ progress_bar.py
│     │     │  │  │  ├─ prompt.py
│     │     │  │  │  ├─ protocol.py
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ region.py
│     │     │  │  │  ├─ repr.py
│     │     │  │  │  ├─ rule.py
│     │     │  │  │  ├─ scope.py
│     │     │  │  │  ├─ screen.py
│     │     │  │  │  ├─ segment.py
│     │     │  │  │  ├─ spinner.py
│     │     │  │  │  ├─ status.py
│     │     │  │  │  ├─ style.py
│     │     │  │  │  ├─ styled.py
│     │     │  │  │  ├─ syntax.py
│     │     │  │  │  ├─ table.py
│     │     │  │  │  ├─ terminal_theme.py
│     │     │  │  │  ├─ text.py
│     │     │  │  │  ├─ theme.py
│     │     │  │  │  ├─ themes.py
│     │     │  │  │  ├─ traceback.py
│     │     │  │  │  ├─ tree.py
│     │     │  │  │  ├─ _cell_widths.py
│     │     │  │  │  ├─ _emoji_codes.py
│     │     │  │  │  ├─ _emoji_replace.py
│     │     │  │  │  ├─ _export_format.py
│     │     │  │  │  ├─ _extension.py
│     │     │  │  │  ├─ _fileno.py
│     │     │  │  │  ├─ _inspect.py
│     │     │  │  │  ├─ _log_render.py
│     │     │  │  │  ├─ _loop.py
│     │     │  │  │  ├─ _null_file.py
│     │     │  │  │  ├─ _palettes.py
│     │     │  │  │  ├─ _pick.py
│     │     │  │  │  ├─ _ratio.py
│     │     │  │  │  ├─ _spinners.py
│     │     │  │  │  ├─ _stack.py
│     │     │  │  │  ├─ _timer.py
│     │     │  │  │  ├─ _win32_console.py
│     │     │  │  │  ├─ _windows.py
│     │     │  │  │  ├─ _windows_renderer.py
│     │     │  │  │  ├─ _wrap.py
│     │     │  │  │  ├─ __init__.py
│     │     │  │  │  └─ __main__.py
│     │     │  │  ├─ tomli
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _parser.py
│     │     │  │  │  ├─ _re.py
│     │     │  │  │  ├─ _types.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ tomli_w
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _writer.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ truststore
│     │     │  │  │  ├─ LICENSE
│     │     │  │  │  ├─ py.typed
│     │     │  │  │  ├─ _api.py
│     │     │  │  │  ├─ _macos.py
│     │     │  │  │  ├─ _openssl.py
│     │     │  │  │  ├─ _ssl_constants.py
│     │     │  │  │  ├─ _windows.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ urllib3
│     │     │  │  │  ├─ connection.py
│     │     │  │  │  ├─ connectionpool.py
│     │     │  │  │  ├─ contrib
│     │     │  │  │  │  ├─ appengine.py
│     │     │  │  │  │  ├─ ntlmpool.py
│     │     │  │  │  │  ├─ pyopenssl.py
│     │     │  │  │  │  ├─ securetransport.py
│     │     │  │  │  │  ├─ socks.py
│     │     │  │  │  │  ├─ _appengine_environ.py
│     │     │  │  │  │  ├─ _securetransport
│     │     │  │  │  │  │  ├─ bindings.py
│     │     │  │  │  │  │  ├─ low_level.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ fields.py
│     │     │  │  │  ├─ filepost.py
│     │     │  │  │  ├─ LICENSE.txt
│     │     │  │  │  ├─ packages
│     │     │  │  │  │  ├─ backports
│     │     │  │  │  │  │  ├─ makefile.py
│     │     │  │  │  │  │  ├─ weakref_finalize.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ six.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ poolmanager.py
│     │     │  │  │  ├─ request.py
│     │     │  │  │  ├─ response.py
│     │     │  │  │  ├─ util
│     │     │  │  │  │  ├─ connection.py
│     │     │  │  │  │  ├─ proxy.py
│     │     │  │  │  │  ├─ queue.py
│     │     │  │  │  │  ├─ request.py
│     │     │  │  │  │  ├─ response.py
│     │     │  │  │  │  ├─ retry.py
│     │     │  │  │  │  ├─ ssltransport.py
│     │     │  │  │  │  ├─ ssl_.py
│     │     │  │  │  │  ├─ ssl_match_hostname.py
│     │     │  │  │  │  ├─ timeout.py
│     │     │  │  │  │  ├─ url.py
│     │     │  │  │  │  ├─ wait.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ _collections.py
│     │     │  │  │  ├─ _version.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ vendor.txt
│     │     │  │  └─ __init__.py
│     │     │  ├─ __init__.py
│     │     │  ├─ __main__.py
│     │     │  └─ __pip-runner__.py
│     │     ├─ png.py
│     │     ├─ propcache
│     │     │  ├─ api.py
│     │     │  ├─ py.typed
│     │     │  ├─ _helpers.py
│     │     │  ├─ _helpers_c.cp312-win_amd64.pyd
│     │     │  ├─ _helpers_c.pyx
│     │     │  ├─ _helpers_py.py
│     │     │  └─ __init__.py
│     │     ├─ proto
│     │     │  ├─ datetime_helpers.py
│     │     │  ├─ enums.py
│     │     │  ├─ fields.py
│     │     │  ├─ marshal
│     │     │  │  ├─ collections
│     │     │  │  │  ├─ maps.py
│     │     │  │  │  ├─ repeated.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ compat.py
│     │     │  │  ├─ marshal.py
│     │     │  │  ├─ rules
│     │     │  │  │  ├─ bytes.py
│     │     │  │  │  ├─ dates.py
│     │     │  │  │  ├─ enums.py
│     │     │  │  │  ├─ field_mask.py
│     │     │  │  │  ├─ message.py
│     │     │  │  │  ├─ stringy_numbers.py
│     │     │  │  │  ├─ struct.py
│     │     │  │  │  ├─ wrappers.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ message.py
│     │     │  ├─ modules.py
│     │     │  ├─ primitives.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ _file_info.py
│     │     │  ├─ _package_info.py
│     │     │  └─ __init__.py
│     │     ├─ pyasn1
│     │     │  ├─ codec
│     │     │  │  ├─ ber
│     │     │  │  │  ├─ decoder.py
│     │     │  │  │  ├─ encoder.py
│     │     │  │  │  ├─ eoo.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ cer
│     │     │  │  │  ├─ decoder.py
│     │     │  │  │  ├─ encoder.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ der
│     │     │  │  │  ├─ decoder.py
│     │     │  │  │  ├─ encoder.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ native
│     │     │  │  │  ├─ decoder.py
│     │     │  │  │  ├─ encoder.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ streaming.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ compat
│     │     │  │  ├─ integer.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ debug.py
│     │     │  ├─ error.py
│     │     │  ├─ type
│     │     │  │  ├─ base.py
│     │     │  │  ├─ char.py
│     │     │  │  ├─ constraint.py
│     │     │  │  ├─ error.py
│     │     │  │  ├─ namedtype.py
│     │     │  │  ├─ namedval.py
│     │     │  │  ├─ opentype.py
│     │     │  │  ├─ tag.py
│     │     │  │  ├─ tagmap.py
│     │     │  │  ├─ univ.py
│     │     │  │  ├─ useful.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ pyasn1_modules
│     │     │  ├─ pem.py
│     │     │  ├─ rfc1155.py
│     │     │  ├─ rfc1157.py
│     │     │  ├─ rfc1901.py
│     │     │  ├─ rfc1902.py
│     │     │  ├─ rfc1905.py
│     │     │  ├─ rfc2251.py
│     │     │  ├─ rfc2314.py
│     │     │  ├─ rfc2315.py
│     │     │  ├─ rfc2437.py
│     │     │  ├─ rfc2459.py
│     │     │  ├─ rfc2511.py
│     │     │  ├─ rfc2560.py
│     │     │  ├─ rfc2631.py
│     │     │  ├─ rfc2634.py
│     │     │  ├─ rfc2876.py
│     │     │  ├─ rfc2985.py
│     │     │  ├─ rfc2986.py
│     │     │  ├─ rfc3058.py
│     │     │  ├─ rfc3114.py
│     │     │  ├─ rfc3125.py
│     │     │  ├─ rfc3161.py
│     │     │  ├─ rfc3274.py
│     │     │  ├─ rfc3279.py
│     │     │  ├─ rfc3280.py
│     │     │  ├─ rfc3281.py
│     │     │  ├─ rfc3370.py
│     │     │  ├─ rfc3412.py
│     │     │  ├─ rfc3414.py
│     │     │  ├─ rfc3447.py
│     │     │  ├─ rfc3537.py
│     │     │  ├─ rfc3560.py
│     │     │  ├─ rfc3565.py
│     │     │  ├─ rfc3657.py
│     │     │  ├─ rfc3709.py
│     │     │  ├─ rfc3739.py
│     │     │  ├─ rfc3770.py
│     │     │  ├─ rfc3779.py
│     │     │  ├─ rfc3820.py
│     │     │  ├─ rfc3852.py
│     │     │  ├─ rfc4010.py
│     │     │  ├─ rfc4043.py
│     │     │  ├─ rfc4055.py
│     │     │  ├─ rfc4073.py
│     │     │  ├─ rfc4108.py
│     │     │  ├─ rfc4210.py
│     │     │  ├─ rfc4211.py
│     │     │  ├─ rfc4334.py
│     │     │  ├─ rfc4357.py
│     │     │  ├─ rfc4387.py
│     │     │  ├─ rfc4476.py
│     │     │  ├─ rfc4490.py
│     │     │  ├─ rfc4491.py
│     │     │  ├─ rfc4683.py
│     │     │  ├─ rfc4985.py
│     │     │  ├─ rfc5035.py
│     │     │  ├─ rfc5083.py
│     │     │  ├─ rfc5084.py
│     │     │  ├─ rfc5126.py
│     │     │  ├─ rfc5208.py
│     │     │  ├─ rfc5275.py
│     │     │  ├─ rfc5280.py
│     │     │  ├─ rfc5480.py
│     │     │  ├─ rfc5636.py
│     │     │  ├─ rfc5639.py
│     │     │  ├─ rfc5649.py
│     │     │  ├─ rfc5652.py
│     │     │  ├─ rfc5697.py
│     │     │  ├─ rfc5751.py
│     │     │  ├─ rfc5752.py
│     │     │  ├─ rfc5753.py
│     │     │  ├─ rfc5755.py
│     │     │  ├─ rfc5913.py
│     │     │  ├─ rfc5914.py
│     │     │  ├─ rfc5915.py
│     │     │  ├─ rfc5916.py
│     │     │  ├─ rfc5917.py
│     │     │  ├─ rfc5924.py
│     │     │  ├─ rfc5934.py
│     │     │  ├─ rfc5940.py
│     │     │  ├─ rfc5958.py
│     │     │  ├─ rfc5990.py
│     │     │  ├─ rfc6010.py
│     │     │  ├─ rfc6019.py
│     │     │  ├─ rfc6031.py
│     │     │  ├─ rfc6032.py
│     │     │  ├─ rfc6120.py
│     │     │  ├─ rfc6170.py
│     │     │  ├─ rfc6187.py
│     │     │  ├─ rfc6210.py
│     │     │  ├─ rfc6211.py
│     │     │  ├─ rfc6402.py
│     │     │  ├─ rfc6482.py
│     │     │  ├─ rfc6486.py
│     │     │  ├─ rfc6487.py
│     │     │  ├─ rfc6664.py
│     │     │  ├─ rfc6955.py
│     │     │  ├─ rfc6960.py
│     │     │  ├─ rfc7030.py
│     │     │  ├─ rfc7191.py
│     │     │  ├─ rfc7229.py
│     │     │  ├─ rfc7292.py
│     │     │  ├─ rfc7296.py
│     │     │  ├─ rfc7508.py
│     │     │  ├─ rfc7585.py
│     │     │  ├─ rfc7633.py
│     │     │  ├─ rfc7773.py
│     │     │  ├─ rfc7894.py
│     │     │  ├─ rfc7906.py
│     │     │  ├─ rfc7914.py
│     │     │  ├─ rfc8017.py
│     │     │  ├─ rfc8018.py
│     │     │  ├─ rfc8103.py
│     │     │  ├─ rfc8209.py
│     │     │  ├─ rfc8226.py
│     │     │  ├─ rfc8358.py
│     │     │  ├─ rfc8360.py
│     │     │  ├─ rfc8398.py
│     │     │  ├─ rfc8410.py
│     │     │  ├─ rfc8418.py
│     │     │  ├─ rfc8419.py
│     │     │  ├─ rfc8479.py
│     │     │  ├─ rfc8494.py
│     │     │  ├─ rfc8520.py
│     │     │  ├─ rfc8619.py
│     │     │  ├─ rfc8649.py
│     │     │  ├─ rfc8692.py
│     │     │  ├─ rfc8696.py
│     │     │  ├─ rfc8702.py
│     │     │  ├─ rfc8708.py
│     │     │  ├─ rfc8769.py
│     │     │  └─ __init__.py
│     │     ├─ pycparser
│     │     │  ├─ ast_transforms.py
│     │     │  ├─ c_ast.py
│     │     │  ├─ c_generator.py
│     │     │  ├─ c_lexer.py
│     │     │  ├─ c_parser.py
│     │     │  ├─ lextab.py
│     │     │  ├─ ply
│     │     │  │  ├─ cpp.py
│     │     │  │  ├─ ctokens.py
│     │     │  │  ├─ lex.py
│     │     │  │  ├─ yacc.py
│     │     │  │  ├─ ygen.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ plyparser.py
│     │     │  ├─ yacctab.py
│     │     │  ├─ _ast_gen.py
│     │     │  ├─ _build_tables.py
│     │     │  ├─ _c_ast.cfg
│     │     │  └─ __init__.py
│     │     ├─ pydantic
│     │     │  ├─ alias_generators.py
│     │     │  ├─ annotated_handlers.py
│     │     │  ├─ class_validators.py
│     │     │  ├─ color.py
│     │     │  ├─ config.py
│     │     │  ├─ dataclasses.py
│     │     │  ├─ datetime_parse.py
│     │     │  ├─ decorator.py
│     │     │  ├─ deprecated
│     │     │  │  ├─ class_validators.py
│     │     │  │  ├─ config.py
│     │     │  │  ├─ copy_internals.py
│     │     │  │  ├─ decorator.py
│     │     │  │  ├─ json.py
│     │     │  │  ├─ parse.py
│     │     │  │  ├─ tools.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ env_settings.py
│     │     │  ├─ errors.py
│     │     │  ├─ error_wrappers.py
│     │     │  ├─ fields.py
│     │     │  ├─ functional_serializers.py
│     │     │  ├─ functional_validators.py
│     │     │  ├─ generics.py
│     │     │  ├─ json.py
│     │     │  ├─ json_schema.py
│     │     │  ├─ main.py
│     │     │  ├─ mypy.py
│     │     │  ├─ networks.py
│     │     │  ├─ parse.py
│     │     │  ├─ plugin
│     │     │  │  ├─ _loader.py
│     │     │  │  ├─ _schema_validator.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ py.typed
│     │     │  ├─ root_model.py
│     │     │  ├─ schema.py
│     │     │  ├─ tools.py
│     │     │  ├─ types.py
│     │     │  ├─ type_adapter.py
│     │     │  ├─ typing.py
│     │     │  ├─ utils.py
│     │     │  ├─ v1
│     │     │  │  ├─ annotated_types.py
│     │     │  │  ├─ class_validators.py
│     │     │  │  ├─ color.py
│     │     │  │  ├─ config.py
│     │     │  │  ├─ dataclasses.py
│     │     │  │  ├─ datetime_parse.py
│     │     │  │  ├─ decorator.py
│     │     │  │  ├─ env_settings.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ error_wrappers.py
│     │     │  │  ├─ fields.py
│     │     │  │  ├─ generics.py
│     │     │  │  ├─ json.py
│     │     │  │  ├─ main.py
│     │     │  │  ├─ mypy.py
│     │     │  │  ├─ networks.py
│     │     │  │  ├─ parse.py
│     │     │  │  ├─ py.typed
│     │     │  │  ├─ schema.py
│     │     │  │  ├─ tools.py
│     │     │  │  ├─ types.py
│     │     │  │  ├─ typing.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ validators.py
│     │     │  │  ├─ version.py
│     │     │  │  ├─ _hypothesis_plugin.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ validate_call_decorator.py
│     │     │  ├─ validators.py
│     │     │  ├─ version.py
│     │     │  ├─ warnings.py
│     │     │  ├─ _internal
│     │     │  │  ├─ _config.py
│     │     │  │  ├─ _core_metadata.py
│     │     │  │  ├─ _core_utils.py
│     │     │  │  ├─ _dataclasses.py
│     │     │  │  ├─ _decorators.py
│     │     │  │  ├─ _decorators_v1.py
│     │     │  │  ├─ _discriminated_union.py
│     │     │  │  ├─ _fields.py
│     │     │  │  ├─ _forward_ref.py
│     │     │  │  ├─ _generate_schema.py
│     │     │  │  ├─ _generics.py
│     │     │  │  ├─ _internal_dataclass.py
│     │     │  │  ├─ _known_annotated_metadata.py
│     │     │  │  ├─ _mock_val_ser.py
│     │     │  │  ├─ _model_construction.py
│     │     │  │  ├─ _repr.py
│     │     │  │  ├─ _schema_generation_shared.py
│     │     │  │  ├─ _std_types_schema.py
│     │     │  │  ├─ _typing_extra.py
│     │     │  │  ├─ _utils.py
│     │     │  │  ├─ _validate_call.py
│     │     │  │  ├─ _validators.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _migration.py
│     │     │  └─ __init__.py
│     │     ├─ pydantic_core
│     │     │  ├─ core_schema.py
│     │     │  ├─ py.typed
│     │     │  ├─ _pydantic_core.cp312-win_amd64.pyd
│     │     │  ├─ _pydantic_core.pyi
│     │     │  └─ __init__.py
│     │     ├─ pydantic_settings
│     │     │  ├─ main.py
│     │     │  ├─ py.typed
│     │     │  ├─ sources.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  └─ __init__.py
│     │     ├─ pymongo
│     │     │  ├─ aggregation.py
│     │     │  ├─ auth.py
│     │     │  ├─ auth_aws.py
│     │     │  ├─ auth_oidc.py
│     │     │  ├─ bulk.py
│     │     │  ├─ change_stream.py
│     │     │  ├─ client_options.py
│     │     │  ├─ client_session.py
│     │     │  ├─ collation.py
│     │     │  ├─ collection.py
│     │     │  ├─ command_cursor.py
│     │     │  ├─ common.py
│     │     │  ├─ compression_support.py
│     │     │  ├─ cursor.py
│     │     │  ├─ daemon.py
│     │     │  ├─ database.py
│     │     │  ├─ driver_info.py
│     │     │  ├─ encryption.py
│     │     │  ├─ encryption_options.py
│     │     │  ├─ errors.py
│     │     │  ├─ event_loggers.py
│     │     │  ├─ hello.py
│     │     │  ├─ helpers.py
│     │     │  ├─ lock.py
│     │     │  ├─ max_staleness_selectors.py
│     │     │  ├─ message.py
│     │     │  ├─ mongo_client.py
│     │     │  ├─ monitor.py
│     │     │  ├─ monitoring.py
│     │     │  ├─ network.py
│     │     │  ├─ ocsp_cache.py
│     │     │  ├─ ocsp_support.py
│     │     │  ├─ operations.py
│     │     │  ├─ periodic_executor.py
│     │     │  ├─ pool.py
│     │     │  ├─ py.typed
│     │     │  ├─ pyopenssl_context.py
│     │     │  ├─ read_concern.py
│     │     │  ├─ read_preferences.py
│     │     │  ├─ response.py
│     │     │  ├─ results.py
│     │     │  ├─ saslprep.py
│     │     │  ├─ server.py
│     │     │  ├─ server_api.py
│     │     │  ├─ server_description.py
│     │     │  ├─ server_selectors.py
│     │     │  ├─ server_type.py
│     │     │  ├─ settings.py
│     │     │  ├─ socket_checker.py
│     │     │  ├─ srv_resolver.py
│     │     │  ├─ ssl_context.py
│     │     │  ├─ ssl_support.py
│     │     │  ├─ topology.py
│     │     │  ├─ topology_description.py
│     │     │  ├─ typings.py
│     │     │  ├─ uri_parser.py
│     │     │  ├─ write_concern.py
│     │     │  ├─ _cmessage.cp312-win_amd64.pyd
│     │     │  ├─ _cmessagemodule.c
│     │     │  ├─ _csot.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ pyotp
│     │     │  ├─ compat.py
│     │     │  ├─ contrib
│     │     │  │  ├─ steam.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ hotp.py
│     │     │  ├─ otp.py
│     │     │  ├─ py.typed
│     │     │  ├─ totp.py
│     │     │  ├─ utils.py
│     │     │  └─ __init__.py
│     │     ├─ pyparsing
│     │     │  ├─ actions.py
│     │     │  ├─ common.py
│     │     │  ├─ core.py
│     │     │  ├─ diagram
│     │     │  │  └─ __init__.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ helpers.py
│     │     │  ├─ py.typed
│     │     │  ├─ results.py
│     │     │  ├─ testing.py
│     │     │  ├─ tools
│     │     │  │  ├─ cvt_pyparsing_pep8_names.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ unicode.py
│     │     │  ├─ util.py
│     │     │  └─ __init__.py
│     │     ├─ qrcode
│     │     │  ├─ base.py
│     │     │  ├─ compat
│     │     │  │  ├─ etree.py
│     │     │  │  ├─ pil.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ console_scripts.py
│     │     │  ├─ constants.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ image
│     │     │  │  ├─ base.py
│     │     │  │  ├─ pil.py
│     │     │  │  ├─ pure.py
│     │     │  │  ├─ styledpil.py
│     │     │  │  ├─ styles
│     │     │  │  │  ├─ colormasks.py
│     │     │  │  │  ├─ moduledrawers
│     │     │  │  │  │  ├─ base.py
│     │     │  │  │  │  ├─ pil.py
│     │     │  │  │  │  ├─ svg.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ svg.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ LUT.py
│     │     │  ├─ main.py
│     │     │  ├─ release.py
│     │     │  ├─ tests
│     │     │  │  ├─ test_example.py
│     │     │  │  ├─ test_qrcode.py
│     │     │  │  ├─ test_qrcode_svg.py
│     │     │  │  ├─ test_release.py
│     │     │  │  ├─ test_script.py
│     │     │  │  ├─ test_util.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ util.py
│     │     │  └─ __init__.py
│     │     ├─ redis
│     │     │  ├─ asyncio
│     │     │  │  ├─ client.py
│     │     │  │  ├─ cluster.py
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ lock.py
│     │     │  │  ├─ retry.py
│     │     │  │  ├─ sentinel.py
│     │     │  │  ├─ utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ backoff.py
│     │     │  ├─ client.py
│     │     │  ├─ cluster.py
│     │     │  ├─ commands
│     │     │  │  ├─ bf
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ info.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ cluster.py
│     │     │  │  ├─ core.py
│     │     │  │  ├─ graph
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ edge.py
│     │     │  │  │  ├─ exceptions.py
│     │     │  │  │  ├─ execution_plan.py
│     │     │  │  │  ├─ node.py
│     │     │  │  │  ├─ path.py
│     │     │  │  │  ├─ query_result.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ helpers.py
│     │     │  │  ├─ json
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ decoders.py
│     │     │  │  │  ├─ path.py
│     │     │  │  │  ├─ _util.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ redismodules.py
│     │     │  │  ├─ search
│     │     │  │  │  ├─ aggregation.py
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ document.py
│     │     │  │  │  ├─ field.py
│     │     │  │  │  ├─ indexDefinition.py
│     │     │  │  │  ├─ query.py
│     │     │  │  │  ├─ querystring.py
│     │     │  │  │  ├─ reducers.py
│     │     │  │  │  ├─ result.py
│     │     │  │  │  ├─ suggestion.py
│     │     │  │  │  ├─ _util.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ sentinel.py
│     │     │  │  ├─ timeseries
│     │     │  │  │  ├─ commands.py
│     │     │  │  │  ├─ info.py
│     │     │  │  │  ├─ utils.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ compat.py
│     │     │  ├─ connection.py
│     │     │  ├─ crc.py
│     │     │  ├─ credentials.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ lock.py
│     │     │  ├─ ocsp.py
│     │     │  ├─ py.typed
│     │     │  ├─ retry.py
│     │     │  ├─ sentinel.py
│     │     │  ├─ typing.py
│     │     │  ├─ utils.py
│     │     │  ├─ _parsers
│     │     │  │  ├─ base.py
│     │     │  │  ├─ commands.py
│     │     │  │  ├─ encoders.py
│     │     │  │  ├─ helpers.py
│     │     │  │  ├─ hiredis.py
│     │     │  │  ├─ resp2.py
│     │     │  │  ├─ resp3.py
│     │     │  │  ├─ socket.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ requests
│     │     │  ├─ adapters.py
│     │     │  ├─ api.py
│     │     │  ├─ auth.py
│     │     │  ├─ certs.py
│     │     │  ├─ compat.py
│     │     │  ├─ cookies.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ help.py
│     │     │  ├─ hooks.py
│     │     │  ├─ models.py
│     │     │  ├─ packages.py
│     │     │  ├─ sessions.py
│     │     │  ├─ status_codes.py
│     │     │  ├─ structures.py
│     │     │  ├─ utils.py
│     │     │  ├─ _internal_utils.py
│     │     │  ├─ __init__.py
│     │     │  └─ __version__.py
│     │     ├─ requests_oauthlib
│     │     │  ├─ compliance_fixes
│     │     │  │  ├─ douban.py
│     │     │  │  ├─ ebay.py
│     │     │  │  ├─ facebook.py
│     │     │  │  ├─ fitbit.py
│     │     │  │  ├─ instagram.py
│     │     │  │  ├─ mailchimp.py
│     │     │  │  ├─ plentymarkets.py
│     │     │  │  ├─ slack.py
│     │     │  │  ├─ weibo.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ oauth1_auth.py
│     │     │  ├─ oauth1_session.py
│     │     │  ├─ oauth2_auth.py
│     │     │  ├─ oauth2_session.py
│     │     │  └─ __init__.py
│     │     ├─ rsa
│     │     │  ├─ asn1.py
│     │     │  ├─ cli.py
│     │     │  ├─ common.py
│     │     │  ├─ core.py
│     │     │  ├─ key.py
│     │     │  ├─ parallel.py
│     │     │  ├─ pem.py
│     │     │  ├─ pkcs1.py
│     │     │  ├─ pkcs1_v2.py
│     │     │  ├─ prime.py
│     │     │  ├─ py.typed
│     │     │  ├─ randnum.py
│     │     │  ├─ transform.py
│     │     │  ├─ util.py
│     │     │  └─ __init__.py
│     │     ├─ scripts
│     │     │  └─ readme-gen
│     │     │     └─ readme_gen.py
│     │     ├─ six.py
│     │     ├─ sniffio
│     │     │  ├─ py.typed
│     │     │  ├─ _impl.py
│     │     │  ├─ _tests
│     │     │  │  ├─ test_sniffio.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ soupsieve
│     │     │  ├─ css_match.py
│     │     │  ├─ css_parser.py
│     │     │  ├─ css_types.py
│     │     │  ├─ pretty.py
│     │     │  ├─ py.typed
│     │     │  ├─ util.py
│     │     │  ├─ __init__.py
│     │     │  └─ __meta__.py
│     │     ├─ starlette
│     │     │  ├─ applications.py
│     │     │  ├─ authentication.py
│     │     │  ├─ background.py
│     │     │  ├─ concurrency.py
│     │     │  ├─ config.py
│     │     │  ├─ convertors.py
│     │     │  ├─ datastructures.py
│     │     │  ├─ endpoints.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ formparsers.py
│     │     │  ├─ middleware
│     │     │  │  ├─ authentication.py
│     │     │  │  ├─ base.py
│     │     │  │  ├─ cors.py
│     │     │  │  ├─ errors.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ gzip.py
│     │     │  │  ├─ httpsredirect.py
│     │     │  │  ├─ sessions.py
│     │     │  │  ├─ trustedhost.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ py.typed
│     │     │  ├─ requests.py
│     │     │  ├─ responses.py
│     │     │  ├─ routing.py
│     │     │  ├─ schemas.py
│     │     │  ├─ staticfiles.py
│     │     │  ├─ status.py
│     │     │  ├─ templating.py
│     │     │  ├─ testclient.py
│     │     │  ├─ types.py
│     │     │  ├─ websockets.py
│     │     │  ├─ _compat.py
│     │     │  ├─ _utils.py
│     │     │  └─ __init__.py
│     │     ├─ toml
│     │     │  ├─ decoder.py
│     │     │  ├─ encoder.py
│     │     │  ├─ ordered.py
│     │     │  ├─ tz.py
│     │     │  └─ __init__.py
│     │     ├─ twilio
│     │     │  ├─ base
│     │     │  │  ├─ client_base.py
│     │     │  │  ├─ deserialize.py
│     │     │  │  ├─ domain.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ instance_context.py
│     │     │  │  ├─ instance_resource.py
│     │     │  │  ├─ list_resource.py
│     │     │  │  ├─ obsolete.py
│     │     │  │  ├─ page.py
│     │     │  │  ├─ serialize.py
│     │     │  │  ├─ values.py
│     │     │  │  ├─ version.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ http
│     │     │  │  ├─ async_http_client.py
│     │     │  │  ├─ http_client.py
│     │     │  │  ├─ request.py
│     │     │  │  ├─ response.py
│     │     │  │  ├─ validation_client.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ jwt
│     │     │  │  ├─ access_token
│     │     │  │  │  ├─ grants.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ client
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ taskrouter
│     │     │  │  │  ├─ capabilities.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ validation
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ request_validator.py
│     │     │  ├─ rest
│     │     │  │  ├─ accounts
│     │     │  │  │  ├─ AccountsBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ auth_token_promotion.py
│     │     │  │  │  │  ├─ credential
│     │     │  │  │  │  │  ├─ aws.py
│     │     │  │  │  │  │  ├─ public_key.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ safelist.py
│     │     │  │  │  │  ├─ secondary_auth_token.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ api
│     │     │  │  │  ├─ ApiBase.py
│     │     │  │  │  ├─ v2010
│     │     │  │  │  │  ├─ account
│     │     │  │  │  │  │  ├─ address
│     │     │  │  │  │  │  │  ├─ dependent_phone_number.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ application.py
│     │     │  │  │  │  │  ├─ authorized_connect_app.py
│     │     │  │  │  │  │  ├─ available_phone_number_country
│     │     │  │  │  │  │  │  ├─ local.py
│     │     │  │  │  │  │  │  ├─ machine_to_machine.py
│     │     │  │  │  │  │  │  ├─ mobile.py
│     │     │  │  │  │  │  │  ├─ national.py
│     │     │  │  │  │  │  │  ├─ shared_cost.py
│     │     │  │  │  │  │  │  ├─ toll_free.py
│     │     │  │  │  │  │  │  ├─ voip.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ balance.py
│     │     │  │  │  │  │  ├─ call
│     │     │  │  │  │  │  │  ├─ event.py
│     │     │  │  │  │  │  │  ├─ feedback.py
│     │     │  │  │  │  │  │  ├─ feedback_summary.py
│     │     │  │  │  │  │  │  ├─ notification.py
│     │     │  │  │  │  │  │  ├─ payment.py
│     │     │  │  │  │  │  │  ├─ recording.py
│     │     │  │  │  │  │  │  ├─ siprec.py
│     │     │  │  │  │  │  │  ├─ stream.py
│     │     │  │  │  │  │  │  ├─ user_defined_message.py
│     │     │  │  │  │  │  │  ├─ user_defined_message_subscription.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ conference
│     │     │  │  │  │  │  │  ├─ participant.py
│     │     │  │  │  │  │  │  ├─ recording.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ connect_app.py
│     │     │  │  │  │  │  ├─ incoming_phone_number
│     │     │  │  │  │  │  │  ├─ assigned_add_on
│     │     │  │  │  │  │  │  │  ├─ assigned_add_on_extension.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ local.py
│     │     │  │  │  │  │  │  ├─ mobile.py
│     │     │  │  │  │  │  │  ├─ toll_free.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ key.py
│     │     │  │  │  │  │  ├─ message
│     │     │  │  │  │  │  │  ├─ feedback.py
│     │     │  │  │  │  │  │  ├─ media.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ new_key.py
│     │     │  │  │  │  │  ├─ new_signing_key.py
│     │     │  │  │  │  │  ├─ notification.py
│     │     │  │  │  │  │  ├─ outgoing_caller_id.py
│     │     │  │  │  │  │  ├─ queue
│     │     │  │  │  │  │  │  ├─ member.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ recording
│     │     │  │  │  │  │  │  ├─ add_on_result
│     │     │  │  │  │  │  │  │  ├─ payload.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ transcription.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ short_code.py
│     │     │  │  │  │  │  ├─ signing_key.py
│     │     │  │  │  │  │  ├─ sip
│     │     │  │  │  │  │  │  ├─ credential_list
│     │     │  │  │  │  │  │  │  ├─ credential.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ domain
│     │     │  │  │  │  │  │  │  ├─ auth_types
│     │     │  │  │  │  │  │  │  │  ├─ auth_type_calls
│     │     │  │  │  │  │  │  │  │  │  ├─ auth_calls_credential_list_mapping.py
│     │     │  │  │  │  │  │  │  │  │  ├─ auth_calls_ip_access_control_list_mapping.py
│     │     │  │  │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  │  │  ├─ auth_type_registrations
│     │     │  │  │  │  │  │  │  │  │  ├─ auth_registrations_credential_list_mapping.py
│     │     │  │  │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  │  ├─ credential_list_mapping.py
│     │     │  │  │  │  │  │  │  ├─ ip_access_control_list_mapping.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ ip_access_control_list
│     │     │  │  │  │  │  │  │  ├─ ip_address.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ token.py
│     │     │  │  │  │  │  ├─ transcription.py
│     │     │  │  │  │  │  ├─ usage
│     │     │  │  │  │  │  │  ├─ record
│     │     │  │  │  │  │  │  │  ├─ all_time.py
│     │     │  │  │  │  │  │  │  ├─ daily.py
│     │     │  │  │  │  │  │  │  ├─ last_month.py
│     │     │  │  │  │  │  │  │  ├─ monthly.py
│     │     │  │  │  │  │  │  │  ├─ this_month.py
│     │     │  │  │  │  │  │  │  ├─ today.py
│     │     │  │  │  │  │  │  │  ├─ yearly.py
│     │     │  │  │  │  │  │  │  ├─ yesterday.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ trigger.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ validation_request.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ autopilot
│     │     │  │  │  ├─ AutopilotBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ assistant
│     │     │  │  │  │  │  ├─ defaults.py
│     │     │  │  │  │  │  ├─ dialogue.py
│     │     │  │  │  │  │  ├─ field_type
│     │     │  │  │  │  │  │  ├─ field_value.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ model_build.py
│     │     │  │  │  │  │  ├─ query.py
│     │     │  │  │  │  │  ├─ style_sheet.py
│     │     │  │  │  │  │  ├─ task
│     │     │  │  │  │  │  │  ├─ field.py
│     │     │  │  │  │  │  │  ├─ sample.py
│     │     │  │  │  │  │  │  ├─ task_actions.py
│     │     │  │  │  │  │  │  ├─ task_statistics.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ restore_assistant.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ bulkexports
│     │     │  │  │  ├─ BulkexportsBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ export
│     │     │  │  │  │  │  ├─ day.py
│     │     │  │  │  │  │  ├─ export_custom_job.py
│     │     │  │  │  │  │  ├─ job.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ export_configuration.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ chat
│     │     │  │  │  ├─ ChatBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ credential.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ channel
│     │     │  │  │  │  │  │  ├─ invite.py
│     │     │  │  │  │  │  │  ├─ member.py
│     │     │  │  │  │  │  │  ├─ message.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ role.py
│     │     │  │  │  │  │  ├─ user
│     │     │  │  │  │  │  │  ├─ user_channel.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ credential.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ binding.py
│     │     │  │  │  │  │  ├─ channel
│     │     │  │  │  │  │  │  ├─ invite.py
│     │     │  │  │  │  │  │  ├─ member.py
│     │     │  │  │  │  │  │  ├─ message.py
│     │     │  │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ role.py
│     │     │  │  │  │  │  ├─ user
│     │     │  │  │  │  │  │  ├─ user_binding.py
│     │     │  │  │  │  │  │  ├─ user_channel.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v3
│     │     │  │  │  │  ├─ channel.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ content
│     │     │  │  │  ├─ ContentBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ content
│     │     │  │  │  │  │  ├─ approval_fetch.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ content_and_approvals.py
│     │     │  │  │  │  ├─ legacy_content.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ conversations
│     │     │  │  │  ├─ ConversationsBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ address_configuration.py
│     │     │  │  │  │  ├─ configuration
│     │     │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ conversation
│     │     │  │  │  │  │  ├─ message
│     │     │  │  │  │  │  │  ├─ delivery_receipt.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ participant.py
│     │     │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ credential.py
│     │     │  │  │  │  ├─ participant_conversation.py
│     │     │  │  │  │  ├─ role.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ binding.py
│     │     │  │  │  │  │  ├─ configuration
│     │     │  │  │  │  │  │  ├─ notification.py
│     │     │  │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ conversation
│     │     │  │  │  │  │  │  ├─ message
│     │     │  │  │  │  │  │  │  ├─ delivery_receipt.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ participant.py
│     │     │  │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ participant_conversation.py
│     │     │  │  │  │  │  ├─ role.py
│     │     │  │  │  │  │  ├─ user
│     │     │  │  │  │  │  │  ├─ user_conversation.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ user
│     │     │  │  │  │  │  ├─ user_conversation.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ events
│     │     │  │  │  ├─ EventsBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ event_type.py
│     │     │  │  │  │  ├─ schema
│     │     │  │  │  │  │  ├─ schema_version.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ sink
│     │     │  │  │  │  │  ├─ sink_test.py
│     │     │  │  │  │  │  ├─ sink_validate.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ subscription
│     │     │  │  │  │  │  ├─ subscribed_event.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ flex_api
│     │     │  │  │  ├─ FlexApiBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ assessments.py
│     │     │  │  │  │  ├─ channel.py
│     │     │  │  │  │  ├─ configuration.py
│     │     │  │  │  │  ├─ flex_flow.py
│     │     │  │  │  │  ├─ insights_assessments_comment.py
│     │     │  │  │  │  ├─ insights_conversations.py
│     │     │  │  │  │  ├─ insights_questionnaires.py
│     │     │  │  │  │  ├─ insights_questionnaires_category.py
│     │     │  │  │  │  ├─ insights_questionnaires_question.py
│     │     │  │  │  │  ├─ insights_segments.py
│     │     │  │  │  │  ├─ insights_session.py
│     │     │  │  │  │  ├─ insights_settings_answer_sets.py
│     │     │  │  │  │  ├─ insights_settings_comment.py
│     │     │  │  │  │  ├─ insights_user_roles.py
│     │     │  │  │  │  ├─ interaction
│     │     │  │  │  │  │  ├─ interaction_channel
│     │     │  │  │  │  │  │  ├─ interaction_channel_invite.py
│     │     │  │  │  │  │  │  ├─ interaction_channel_participant.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ web_channel.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ web_channels.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ frontline_api
│     │     │  │  │  ├─ FrontlineApiBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ user.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ insights
│     │     │  │  │  ├─ InsightsBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ call
│     │     │  │  │  │  │  ├─ annotation.py
│     │     │  │  │  │  │  ├─ call_summary.py
│     │     │  │  │  │  │  ├─ event.py
│     │     │  │  │  │  │  ├─ metric.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ call_summaries.py
│     │     │  │  │  │  ├─ conference
│     │     │  │  │  │  │  ├─ conference_participant.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ room
│     │     │  │  │  │  │  ├─ participant.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ setting.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ intelligence
│     │     │  │  │  ├─ IntelligenceBase.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ service.py
│     │     │  │  │  │  ├─ transcript
│     │     │  │  │  │  │  ├─ media.py
│     │     │  │  │  │  │  ├─ operator_result.py
│     │     │  │  │  │  │  ├─ sentence.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ ip_messaging
│     │     │  │  │  ├─ IpMessagingBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ credential.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ channel
│     │     │  │  │  │  │  │  ├─ invite.py
│     │     │  │  │  │  │  │  ├─ member.py
│     │     │  │  │  │  │  │  ├─ message.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ role.py
│     │     │  │  │  │  │  ├─ user
│     │     │  │  │  │  │  │  ├─ user_channel.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ credential.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ binding.py
│     │     │  │  │  │  │  ├─ channel
│     │     │  │  │  │  │  │  ├─ invite.py
│     │     │  │  │  │  │  │  ├─ member.py
│     │     │  │  │  │  │  │  ├─ message.py
│     │     │  │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ role.py
│     │     │  │  │  │  │  ├─ user
│     │     │  │  │  │  │  │  ├─ user_binding.py
│     │     │  │  │  │  │  │  ├─ user_channel.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ lookups
│     │     │  │  │  ├─ LookupsBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ phone_number.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ phone_number.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ media
│     │     │  │  │  ├─ MediaBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ media_processor.py
│     │     │  │  │  │  ├─ media_recording.py
│     │     │  │  │  │  ├─ player_streamer
│     │     │  │  │  │  │  ├─ playback_grant.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ messaging
│     │     │  │  │  ├─ MessagingBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ brand_registration
│     │     │  │  │  │  │  ├─ brand_registration_otp.py
│     │     │  │  │  │  │  ├─ brand_vetting.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ deactivations.py
│     │     │  │  │  │  ├─ domain_certs.py
│     │     │  │  │  │  ├─ domain_config.py
│     │     │  │  │  │  ├─ domain_config_messaging_service.py
│     │     │  │  │  │  ├─ external_campaign.py
│     │     │  │  │  │  ├─ linkshortening_messaging_service.py
│     │     │  │  │  │  ├─ linkshortening_messaging_service_domain_association.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ alpha_sender.py
│     │     │  │  │  │  │  ├─ channel_sender.py
│     │     │  │  │  │  │  ├─ phone_number.py
│     │     │  │  │  │  │  ├─ short_code.py
│     │     │  │  │  │  │  ├─ us_app_to_person.py
│     │     │  │  │  │  │  ├─ us_app_to_person_usecase.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ tollfree_verification.py
│     │     │  │  │  │  ├─ usecase.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ microvisor
│     │     │  │  │  ├─ MicrovisorBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ account_config.py
│     │     │  │  │  │  ├─ account_secret.py
│     │     │  │  │  │  ├─ app
│     │     │  │  │  │  │  ├─ app_manifest.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ device
│     │     │  │  │  │  │  ├─ device_config.py
│     │     │  │  │  │  │  ├─ device_secret.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ monitor
│     │     │  │  │  ├─ MonitorBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ alert.py
│     │     │  │  │  │  ├─ event.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ notify
│     │     │  │  │  ├─ NotifyBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ credential.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ binding.py
│     │     │  │  │  │  │  ├─ notification.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ numbers
│     │     │  │  │  ├─ NumbersBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ bulk_eligibility.py
│     │     │  │  │  │  ├─ porting_bulk_portability.py
│     │     │  │  │  │  ├─ porting_portability.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ authorization_document
│     │     │  │  │  │  │  ├─ dependent_hosted_number_order.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ bulk_hosted_number_order.py
│     │     │  │  │  │  ├─ hosted_number_order.py
│     │     │  │  │  │  ├─ regulatory_compliance
│     │     │  │  │  │  │  ├─ bundle
│     │     │  │  │  │  │  │  ├─ bundle_copy.py
│     │     │  │  │  │  │  │  ├─ evaluation.py
│     │     │  │  │  │  │  │  ├─ item_assignment.py
│     │     │  │  │  │  │  │  ├─ replace_items.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ end_user.py
│     │     │  │  │  │  │  ├─ end_user_type.py
│     │     │  │  │  │  │  ├─ regulation.py
│     │     │  │  │  │  │  ├─ supporting_document.py
│     │     │  │  │  │  │  ├─ supporting_document_type.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ oauth
│     │     │  │  │  ├─ OauthBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ device_code.py
│     │     │  │  │  │  ├─ oauth.py
│     │     │  │  │  │  ├─ openid_discovery.py
│     │     │  │  │  │  ├─ token.py
│     │     │  │  │  │  ├─ user_info.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ preview
│     │     │  │  │  ├─ deployed_devices
│     │     │  │  │  │  ├─ fleet
│     │     │  │  │  │  │  ├─ certificate.py
│     │     │  │  │  │  │  ├─ deployment.py
│     │     │  │  │  │  │  ├─ device.py
│     │     │  │  │  │  │  ├─ key.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ hosted_numbers
│     │     │  │  │  │  ├─ authorization_document
│     │     │  │  │  │  │  ├─ dependent_hosted_number_order.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ hosted_number_order.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ marketplace
│     │     │  │  │  │  ├─ available_add_on
│     │     │  │  │  │  │  ├─ available_add_on_extension.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ installed_add_on
│     │     │  │  │  │  │  ├─ installed_add_on_extension.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ PreviewBase.py
│     │     │  │  │  ├─ sync
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ document
│     │     │  │  │  │  │  │  ├─ document_permission.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ sync_list
│     │     │  │  │  │  │  │  ├─ sync_list_item.py
│     │     │  │  │  │  │  │  ├─ sync_list_permission.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ sync_map
│     │     │  │  │  │  │  │  ├─ sync_map_item.py
│     │     │  │  │  │  │  │  ├─ sync_map_permission.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ understand
│     │     │  │  │  │  ├─ assistant
│     │     │  │  │  │  │  ├─ assistant_fallback_actions.py
│     │     │  │  │  │  │  ├─ assistant_initiation_actions.py
│     │     │  │  │  │  │  ├─ dialogue.py
│     │     │  │  │  │  │  ├─ field_type
│     │     │  │  │  │  │  │  ├─ field_value.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ model_build.py
│     │     │  │  │  │  │  ├─ query.py
│     │     │  │  │  │  │  ├─ style_sheet.py
│     │     │  │  │  │  │  ├─ task
│     │     │  │  │  │  │  │  ├─ field.py
│     │     │  │  │  │  │  │  ├─ sample.py
│     │     │  │  │  │  │  │  ├─ task_actions.py
│     │     │  │  │  │  │  │  ├─ task_statistics.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ wireless
│     │     │  │  │  │  ├─ command.py
│     │     │  │  │  │  ├─ rate_plan.py
│     │     │  │  │  │  ├─ sim
│     │     │  │  │  │  │  ├─ usage.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ pricing
│     │     │  │  │  ├─ PricingBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ messaging
│     │     │  │  │  │  │  ├─ country.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ phone_number
│     │     │  │  │  │  │  ├─ country.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ voice
│     │     │  │  │  │  │  ├─ country.py
│     │     │  │  │  │  │  ├─ number.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ country.py
│     │     │  │  │  │  ├─ number.py
│     │     │  │  │  │  ├─ voice
│     │     │  │  │  │  │  ├─ country.py
│     │     │  │  │  │  │  ├─ number.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ proxy
│     │     │  │  │  ├─ ProxyBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ phone_number.py
│     │     │  │  │  │  │  ├─ session
│     │     │  │  │  │  │  │  ├─ interaction.py
│     │     │  │  │  │  │  │  ├─ participant
│     │     │  │  │  │  │  │  │  ├─ message_interaction.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ short_code.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ routes
│     │     │  │  │  ├─ RoutesBase.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ phone_number.py
│     │     │  │  │  │  ├─ sip_domain.py
│     │     │  │  │  │  ├─ trunk.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ serverless
│     │     │  │  │  ├─ ServerlessBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ asset
│     │     │  │  │  │  │  │  ├─ asset_version.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ build
│     │     │  │  │  │  │  │  ├─ build_status.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ environment
│     │     │  │  │  │  │  │  ├─ deployment.py
│     │     │  │  │  │  │  │  ├─ log.py
│     │     │  │  │  │  │  │  ├─ variable.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ function
│     │     │  │  │  │  │  │  ├─ function_version
│     │     │  │  │  │  │  │  │  ├─ function_version_content.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ studio
│     │     │  │  │  ├─ StudioBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ flow
│     │     │  │  │  │  │  ├─ engagement
│     │     │  │  │  │  │  │  ├─ engagement_context.py
│     │     │  │  │  │  │  │  ├─ step
│     │     │  │  │  │  │  │  │  ├─ step_context.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ execution
│     │     │  │  │  │  │  │  ├─ execution_context.py
│     │     │  │  │  │  │  │  ├─ execution_step
│     │     │  │  │  │  │  │  │  ├─ execution_step_context.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ flow
│     │     │  │  │  │  │  ├─ execution
│     │     │  │  │  │  │  │  ├─ execution_context.py
│     │     │  │  │  │  │  │  ├─ execution_step
│     │     │  │  │  │  │  │  │  ├─ execution_step_context.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ flow_revision.py
│     │     │  │  │  │  │  ├─ flow_test_user.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ flow_validate.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ supersim
│     │     │  │  │  ├─ SupersimBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ esim_profile.py
│     │     │  │  │  │  ├─ fleet.py
│     │     │  │  │  │  ├─ ip_command.py
│     │     │  │  │  │  ├─ network.py
│     │     │  │  │  │  ├─ network_access_profile
│     │     │  │  │  │  │  ├─ network_access_profile_network.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ settings_update.py
│     │     │  │  │  │  ├─ sim
│     │     │  │  │  │  │  ├─ billing_period.py
│     │     │  │  │  │  │  ├─ sim_ip_address.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ sms_command.py
│     │     │  │  │  │  ├─ usage_record.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ sync
│     │     │  │  │  ├─ SyncBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ document
│     │     │  │  │  │  │  │  ├─ document_permission.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ sync_list
│     │     │  │  │  │  │  │  ├─ sync_list_item.py
│     │     │  │  │  │  │  │  ├─ sync_list_permission.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ sync_map
│     │     │  │  │  │  │  │  ├─ sync_map_item.py
│     │     │  │  │  │  │  │  ├─ sync_map_permission.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ sync_stream
│     │     │  │  │  │  │  │  ├─ stream_message.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ taskrouter
│     │     │  │  │  ├─ TaskrouterBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ workspace
│     │     │  │  │  │  │  ├─ activity.py
│     │     │  │  │  │  │  ├─ event.py
│     │     │  │  │  │  │  ├─ task
│     │     │  │  │  │  │  │  ├─ reservation.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ task_channel.py
│     │     │  │  │  │  │  ├─ task_queue
│     │     │  │  │  │  │  │  ├─ task_queues_statistics.py
│     │     │  │  │  │  │  │  ├─ task_queue_cumulative_statistics.py
│     │     │  │  │  │  │  │  ├─ task_queue_real_time_statistics.py
│     │     │  │  │  │  │  │  ├─ task_queue_statistics.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ worker
│     │     │  │  │  │  │  │  ├─ reservation.py
│     │     │  │  │  │  │  │  ├─ workers_cumulative_statistics.py
│     │     │  │  │  │  │  │  ├─ workers_real_time_statistics.py
│     │     │  │  │  │  │  │  ├─ workers_statistics.py
│     │     │  │  │  │  │  │  ├─ worker_channel.py
│     │     │  │  │  │  │  │  ├─ worker_statistics.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ workflow
│     │     │  │  │  │  │  │  ├─ workflow_cumulative_statistics.py
│     │     │  │  │  │  │  │  ├─ workflow_real_time_statistics.py
│     │     │  │  │  │  │  │  ├─ workflow_statistics.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ workspace_cumulative_statistics.py
│     │     │  │  │  │  │  ├─ workspace_real_time_statistics.py
│     │     │  │  │  │  │  ├─ workspace_statistics.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ trunking
│     │     │  │  │  ├─ TrunkingBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ trunk
│     │     │  │  │  │  │  ├─ credential_list.py
│     │     │  │  │  │  │  ├─ ip_access_control_list.py
│     │     │  │  │  │  │  ├─ origination_url.py
│     │     │  │  │  │  │  ├─ phone_number.py
│     │     │  │  │  │  │  ├─ recording.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ trusthub
│     │     │  │  │  ├─ TrusthubBase.py
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ compliance_inquiries.py
│     │     │  │  │  │  ├─ customer_profiles
│     │     │  │  │  │  │  ├─ customer_profiles_channel_endpoint_assignment.py
│     │     │  │  │  │  │  ├─ customer_profiles_entity_assignments.py
│     │     │  │  │  │  │  ├─ customer_profiles_evaluations.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ end_user.py
│     │     │  │  │  │  ├─ end_user_type.py
│     │     │  │  │  │  ├─ policies.py
│     │     │  │  │  │  ├─ supporting_document.py
│     │     │  │  │  │  ├─ supporting_document_type.py
│     │     │  │  │  │  ├─ trust_products
│     │     │  │  │  │  │  ├─ trust_products_channel_endpoint_assignment.py
│     │     │  │  │  │  │  ├─ trust_products_entity_assignments.py
│     │     │  │  │  │  │  ├─ trust_products_evaluations.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ verify
│     │     │  │  │  ├─ v2
│     │     │  │  │  │  ├─ form.py
│     │     │  │  │  │  ├─ safelist.py
│     │     │  │  │  │  ├─ service
│     │     │  │  │  │  │  ├─ access_token.py
│     │     │  │  │  │  │  ├─ entity
│     │     │  │  │  │  │  │  ├─ challenge
│     │     │  │  │  │  │  │  │  ├─ notification.py
│     │     │  │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  │  ├─ factor.py
│     │     │  │  │  │  │  │  ├─ new_factor.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ messaging_configuration.py
│     │     │  │  │  │  │  ├─ rate_limit
│     │     │  │  │  │  │  │  ├─ bucket.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ verification.py
│     │     │  │  │  │  │  ├─ verification_check.py
│     │     │  │  │  │  │  ├─ webhook.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ template.py
│     │     │  │  │  │  ├─ verification_attempt.py
│     │     │  │  │  │  ├─ verification_attempts_summary.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ VerifyBase.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ video
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ composition.py
│     │     │  │  │  │  ├─ composition_hook.py
│     │     │  │  │  │  ├─ composition_settings.py
│     │     │  │  │  │  ├─ recording.py
│     │     │  │  │  │  ├─ recording_settings.py
│     │     │  │  │  │  ├─ room
│     │     │  │  │  │  │  ├─ participant
│     │     │  │  │  │  │  │  ├─ anonymize.py
│     │     │  │  │  │  │  │  ├─ published_track.py
│     │     │  │  │  │  │  │  ├─ subscribed_track.py
│     │     │  │  │  │  │  │  ├─ subscribe_rules.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ recording_rules.py
│     │     │  │  │  │  │  ├─ room_recording.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ VideoBase.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ voice
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ archived_call.py
│     │     │  │  │  │  ├─ byoc_trunk.py
│     │     │  │  │  │  ├─ connection_policy
│     │     │  │  │  │  │  ├─ connection_policy_target.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ dialing_permissions
│     │     │  │  │  │  │  ├─ bulk_country_update.py
│     │     │  │  │  │  │  ├─ country
│     │     │  │  │  │  │  │  ├─ highrisk_special_prefix.py
│     │     │  │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  │  ├─ settings.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ ip_record.py
│     │     │  │  │  │  ├─ source_ip_mapping.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ VoiceBase.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ wireless
│     │     │  │  │  ├─ v1
│     │     │  │  │  │  ├─ command.py
│     │     │  │  │  │  ├─ rate_plan.py
│     │     │  │  │  │  ├─ sim
│     │     │  │  │  │  │  ├─ data_session.py
│     │     │  │  │  │  │  ├─ usage_record.py
│     │     │  │  │  │  │  └─ __init__.py
│     │     │  │  │  │  ├─ usage_record.py
│     │     │  │  │  │  └─ __init__.py
│     │     │  │  │  ├─ WirelessBase.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ twiml
│     │     │  │  ├─ fax_response.py
│     │     │  │  ├─ messaging_response.py
│     │     │  │  ├─ voice_response.py
│     │     │  │  └─ __init__.py
│     │     │  └─ __init__.py
│     │     ├─ typing_extensions.py
│     │     ├─ uritemplate
│     │     │  ├─ api.py
│     │     │  ├─ orderedset.py
│     │     │  ├─ py.typed
│     │     │  ├─ template.py
│     │     │  ├─ variable.py
│     │     │  └─ __init__.py
│     │     ├─ urllib3
│     │     │  ├─ connection.py
│     │     │  ├─ connectionpool.py
│     │     │  ├─ contrib
│     │     │  │  ├─ emscripten
│     │     │  │  │  ├─ connection.py
│     │     │  │  │  ├─ emscripten_fetch_worker.js
│     │     │  │  │  ├─ fetch.py
│     │     │  │  │  ├─ request.py
│     │     │  │  │  ├─ response.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ pyopenssl.py
│     │     │  │  ├─ socks.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ fields.py
│     │     │  ├─ filepost.py
│     │     │  ├─ http2
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ probe.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ poolmanager.py
│     │     │  ├─ py.typed
│     │     │  ├─ response.py
│     │     │  ├─ util
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ proxy.py
│     │     │  │  ├─ request.py
│     │     │  │  ├─ response.py
│     │     │  │  ├─ retry.py
│     │     │  │  ├─ ssltransport.py
│     │     │  │  ├─ ssl_.py
│     │     │  │  ├─ ssl_match_hostname.py
│     │     │  │  ├─ timeout.py
│     │     │  │  ├─ url.py
│     │     │  │  ├─ util.py
│     │     │  │  ├─ wait.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ _base_connection.py
│     │     │  ├─ _collections.py
│     │     │  ├─ _request_methods.py
│     │     │  ├─ _version.py
│     │     │  └─ __init__.py
│     │     ├─ uvicorn
│     │     │  ├─ config.py
│     │     │  ├─ importer.py
│     │     │  ├─ lifespan
│     │     │  │  ├─ off.py
│     │     │  │  ├─ on.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ logging.py
│     │     │  ├─ loops
│     │     │  │  ├─ asyncio.py
│     │     │  │  ├─ auto.py
│     │     │  │  ├─ uvloop.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ main.py
│     │     │  ├─ middleware
│     │     │  │  ├─ asgi2.py
│     │     │  │  ├─ message_logger.py
│     │     │  │  ├─ proxy_headers.py
│     │     │  │  ├─ wsgi.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ protocols
│     │     │  │  ├─ http
│     │     │  │  │  ├─ auto.py
│     │     │  │  │  ├─ flow_control.py
│     │     │  │  │  ├─ h11_impl.py
│     │     │  │  │  ├─ httptools_impl.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  ├─ utils.py
│     │     │  │  ├─ websockets
│     │     │  │  │  ├─ auto.py
│     │     │  │  │  ├─ websockets_impl.py
│     │     │  │  │  ├─ wsproto_impl.py
│     │     │  │  │  └─ __init__.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ py.typed
│     │     │  ├─ server.py
│     │     │  ├─ supervisors
│     │     │  │  ├─ basereload.py
│     │     │  │  ├─ multiprocess.py
│     │     │  │  ├─ statreload.py
│     │     │  │  ├─ watchfilesreload.py
│     │     │  │  ├─ watchgodreload.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ workers.py
│     │     │  ├─ _subprocess.py
│     │     │  ├─ _types.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ watchfiles
│     │     │  ├─ cli.py
│     │     │  ├─ filters.py
│     │     │  ├─ main.py
│     │     │  ├─ py.typed
│     │     │  ├─ run.py
│     │     │  ├─ version.py
│     │     │  ├─ _rust_notify.cp312-win_amd64.pyd
│     │     │  ├─ _rust_notify.pyi
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ websockets
│     │     │  ├─ asyncio
│     │     │  │  ├─ async_timeout.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ compatibility.py
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ messages.py
│     │     │  │  ├─ router.py
│     │     │  │  ├─ server.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ auth.py
│     │     │  ├─ cli.py
│     │     │  ├─ client.py
│     │     │  ├─ connection.py
│     │     │  ├─ datastructures.py
│     │     │  ├─ exceptions.py
│     │     │  ├─ extensions
│     │     │  │  ├─ base.py
│     │     │  │  ├─ permessage_deflate.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ frames.py
│     │     │  ├─ headers.py
│     │     │  ├─ http.py
│     │     │  ├─ http11.py
│     │     │  ├─ imports.py
│     │     │  ├─ legacy
│     │     │  │  ├─ auth.py
│     │     │  │  ├─ client.py
│     │     │  │  ├─ exceptions.py
│     │     │  │  ├─ framing.py
│     │     │  │  ├─ handshake.py
│     │     │  │  ├─ http.py
│     │     │  │  ├─ protocol.py
│     │     │  │  ├─ server.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ protocol.py
│     │     │  ├─ py.typed
│     │     │  ├─ server.py
│     │     │  ├─ speedups.c
│     │     │  ├─ speedups.cp312-win_amd64.pyd
│     │     │  ├─ speedups.pyi
│     │     │  ├─ streams.py
│     │     │  ├─ sync
│     │     │  │  ├─ client.py
│     │     │  │  ├─ connection.py
│     │     │  │  ├─ messages.py
│     │     │  │  ├─ router.py
│     │     │  │  ├─ server.py
│     │     │  │  ├─ utils.py
│     │     │  │  └─ __init__.py
│     │     │  ├─ typing.py
│     │     │  ├─ uri.py
│     │     │  ├─ utils.py
│     │     │  ├─ version.py
│     │     │  ├─ __init__.py
│     │     │  └─ __main__.py
│     │     ├─ yaml
│     │     │  ├─ composer.py
│     │     │  ├─ constructor.py
│     │     │  ├─ cyaml.py
│     │     │  ├─ dumper.py
│     │     │  ├─ emitter.py
│     │     │  ├─ error.py
│     │     │  ├─ events.py
│     │     │  ├─ loader.py
│     │     │  ├─ nodes.py
│     │     │  ├─ parser.py
│     │     │  ├─ reader.py
│     │     │  ├─ representer.py
│     │     │  ├─ resolver.py
│     │     │  ├─ scanner.py
│     │     │  ├─ serializer.py
│     │     │  ├─ tokens.py
│     │     │  ├─ _yaml.cp312-win_amd64.pyd
│     │     │  └─ __init__.py
│     │     ├─ yarl
│     │     │  ├─ py.typed
│     │     │  ├─ _parse.py
│     │     │  ├─ _path.py
│     │     │  ├─ _query.py
│     │     │  ├─ _quoters.py
│     │     │  ├─ _quoting.py
│     │     │  ├─ _quoting_c.cp312-win_amd64.pyd
│     │     │  ├─ _quoting_c.pyx
│     │     │  ├─ _quoting_py.py
│     │     │  ├─ _url.py
│     │     │  └─ __init__.py
│     │     ├─ _argon2_cffi_bindings
│     │     │  ├─ _ffi.pyd
│     │     │  ├─ _ffi_build.py
│     │     │  └─ __init__.py
│     │     ├─ _cffi_backend.cp312-win_amd64.pyd
│     │     └─ _yaml
│     │        └─ __init__.py
│     ├─ pyvenv.cfg
│     ├─ Scripts
│     │  ├─ activate
│     │  ├─ activate.bat
│     │  ├─ Activate.ps1
│     │  ├─ beanie.exe
│     │  ├─ deactivate.bat
│     │  ├─ doesitcache.exe
│     │  ├─ dotenv.exe
│     │  ├─ email_validator.exe
│     │  ├─ fixup_firestore_admin_v1_keywords.py
│     │  ├─ fixup_firestore_v1_keywords.py
│     │  ├─ fonttools.exe
│     │  ├─ google
│     │  ├─ google-oauthlib-tool.exe
│     │  ├─ httpx.exe
│     │  ├─ normalizer.exe
│     │  ├─ pip.exe
│     │  ├─ pip3.12.exe
│     │  ├─ pip3.exe
│     │  ├─ prichunkpng
│     │  ├─ pricolpng
│     │  ├─ priditherpng
│     │  ├─ priforgepng
│     │  ├─ prigreypng
│     │  ├─ pripalpng
│     │  ├─ pripamtopng
│     │  ├─ priplan9topng
│     │  ├─ pripnglsch
│     │  ├─ pripngtopam
│     │  ├─ prirowpng
│     │  ├─ priweavepng
│     │  ├─ pyftmerge.exe
│     │  ├─ pyftsubset.exe
│     │  ├─ pyrsa-decrypt.exe
│     │  ├─ pyrsa-encrypt.exe
│     │  ├─ pyrsa-keygen.exe
│     │  ├─ pyrsa-priv2pub.exe
│     │  ├─ pyrsa-sign.exe
│     │  ├─ pyrsa-verify.exe
│     │  ├─ python.exe
│     │  ├─ pythonw.exe
│     │  ├─ qr.exe
│     │  ├─ ttx.exe
│     │  ├─ uvicorn.exe
│     │  ├─ watchfiles.exe
│     │  └─ websockets.exe
│     └─ share
│        └─ man
│           └─ man1
│              ├─ qr.1
│              └─ ttx.1
├─ bun.lockb
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ favicon.ico
│  ├─ placeholder.svg
│  └─ robots.txt
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ hero-carousel-1.jpg
│  │  ├─ hero-carousel-2.jpg
│  │  ├─ hero-carousel-3.jpg
│  │  └─ hero-carousel-4.jpg
│  ├─ components
│  │  ├─ AboutAndEvents.tsx
│  │  ├─ AvailableSections.tsx
│  │  ├─ CompanyMarquee.tsx
│  │  ├─ dashboard
│  │  │  ├─ JobTypeSelector.tsx
│  │  │  └─ ResumeBuilder.tsx
│  │  ├─ Footer.tsx
│  │  ├─ Gallery.tsx
│  │  ├─ Hero.tsx
│  │  ├─ IndiaInternshipMap.tsx
│  │  ├─ LanguageSelector.tsx
│  │  ├─ Navbar.tsx
│  │  ├─ NavLink.tsx
│  │  └─ ui
│  │     ├─ accordion.tsx
│  │     ├─ alert-dialog.tsx
│  │     ├─ alert.tsx
│  │     ├─ aspect-ratio.tsx
│  │     ├─ avatar.tsx
│  │     ├─ badge.tsx
│  │     ├─ breadcrumb.tsx
│  │     ├─ button.tsx
│  │     ├─ calendar.tsx
│  │     ├─ card.tsx
│  │     ├─ carousel.tsx
│  │     ├─ chart.tsx
│  │     ├─ checkbox.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ command.tsx
│  │     ├─ context-menu.tsx
│  │     ├─ dialog.tsx
│  │     ├─ drawer.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ form.tsx
│  │     ├─ hover-card.tsx
│  │     ├─ input-otp.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ menubar.tsx
│  │     ├─ navigation-menu.tsx
│  │     ├─ pagination.tsx
│  │     ├─ popover.tsx
│  │     ├─ progress.tsx
│  │     ├─ radio-group.tsx
│  │     ├─ resizable.tsx
│  │     ├─ scroll-area.tsx
│  │     ├─ select.tsx
│  │     ├─ separator.tsx
│  │     ├─ sheet.tsx
│  │     ├─ sidebar.tsx
│  │     ├─ skeleton.tsx
│  │     ├─ slider.tsx
│  │     ├─ sonner.tsx
│  │     ├─ switch.tsx
│  │     ├─ table.tsx
│  │     ├─ tabs.tsx
│  │     ├─ textarea.tsx
│  │     ├─ toast.tsx
│  │     ├─ toaster.tsx
│  │     ├─ toggle-group.tsx
│  │     ├─ toggle.tsx
│  │     ├─ tooltip.tsx
│  │     └─ use-toast.ts
│  ├─ firebase.ts
│  ├─ hooks
│  │  ├─ use-mobile.tsx
│  │  └─ use-toast.ts
│  ├─ index.css
│  ├─ lib
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ Index.tsx
│  │  ├─ Login.tsx
│  │  ├─ MultiStepForm.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ PersonalDetails.tsx
│  │  ├─ Signup.tsx
│  │  └─ UserDashboard.tsx
│  ├─ services
│  │  └─ api.ts
│  ├─ types
│  │  └─ auth.ts
│  └─ vite-env.d.ts
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```