# Setup Go Swagger

[![tests](https://github.com/minchao/setup-go-swagger/workflows/tests/badge.svg)](https://github.com/minchao/setup-go-swagger/actions?query=workflow%3Atests)

Set up your GitHub Actions workflow with a specific version of [go-swagger](https://github.com/go-swagger/go-swagger).

## Usage

```yaml
- uses: minchao/setup-go-swagger@v1
  with:
    version: '<version>' # default is latest release
```

To validate a swagger specification:

```yaml
- uses: minchao/setup-go-swagger@v1
- run: swagger validate swagger.json
```

Generate the go client library from swagger specification:

```yaml
- uses: minchao/setup-go-swagger@v1
  with:
    version: v0.26.1
- run: swagger generate client -f swagger.json
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
