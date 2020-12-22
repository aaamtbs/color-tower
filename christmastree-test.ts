// tests go here; this will not be compiled when this package is used as an extension.
{
    let tree = ChristmasTree.create();
    
    input.onButtonPressed(Button.A, () => {
        tree.previousMode()
    });
    input.onButtonPressed(Button.B, () => {
        tree.nextMode()
    });


    basic.forever(function () {
        tree.update();
    })

    control.inBackground(function () {
        
    })
}
