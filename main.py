from website import create_app

app = create_app()

if __name__ == '__main__':
    # Enable Flask debug mode
    app.run(debug=True)