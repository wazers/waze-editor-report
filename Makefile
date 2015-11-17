NAME=wme-report-a-problem
BUILD_DIR=build

chrome: $(BUILD_DIR)
	bash -c 'cd src; zip -r ../$(BUILD_DIR)/${NAME}.$@.zip *'

$(BUILD_DIR):
	mkdir -p $@
