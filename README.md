# SDF Language Support for VS Code

<p align="center">
  <img src="https://img.shields.io/badge/VS%20Code-Extension-blue?style=for-the-badge&logo=visual-studio-code" alt="VS Code Extension">
  <img src="https://img.shields.io/badge/Language-SDF-green?style=for-the-badge" alt="SDF Language">
  <img src="https://img.shields.io/badge/Robotics-Gazebo-orange?style=for-the-badge" alt="Robotics">
</p>

**Professional language support for SDF (Simulation Description Format) files** - the XML-based format used to describe objects, environments, and physics for robot simulators like Gazebo, Isaac Sim, and other robotics platforms.

---

## ✨ Features

### 🎨 **Rich Syntax Highlighting**
- **Semantic highlighting** for different SDF element types:
  - 🌍 **World elements** (world, include, physics) in teal
  - 🤖 **Model elements** (model, link, joint) in purple  
  - ⚡ **Physics elements** (inertial, mass, collision) in yellow
  - 📐 **Geometry elements** (box, sphere, mesh) in cyan
  - 🎭 **Material elements** (material, script, lighting) in orange
  - 📡 **Sensor elements** (camera, lidar, imu) in gold
- **Vector highlighting** for pose coordinates (x y z roll pitch yaw)
- **URI scheme highlighting** for model:// and file:// paths

### 🔍 **Intelligent Error Detection**
- **XML syntax validation** with real-time error reporting
- **SDF structure validation** ensuring proper element hierarchy
- **Required attribute checking** (e.g., name, type, version)
- **Value validation** for joint types, sensor types, and more
- **Mismatched tag detection** with helpful error messages

### 💡 **Smart Code Completion**
- **Context-aware suggestions** for SDF elements and attributes
- **Auto-completion** for joint types (revolute, prismatic, fixed, etc.)
- **Sensor type suggestions** (camera, lidar, imu, gps, etc.)
- **Attribute completion** with documentation hints

### 📚 **Interactive Documentation**
- **Hover tooltips** with element descriptions and usage examples
- **Parameter documentation** for attributes and values
- **Best practices** and common patterns

### 🔧 **Code Formatting**
- **XML auto-formatting** with proper indentation
- **Auto-closing tags** and bracket pairs
- **Smart indentation** for nested SDF structures

---

## 🚀 Quick Start

### Installation

1. **From VS Code Marketplace:**
   ```
   ext install your-publisher.simulation-description-format
   ```

2. **Manual Installation:**
   - Download the `.vsix` file from releases
   - Run `code --install-extension simulation-description-format-x.x.x.vsix`

### Usage

1. **Open any `.sdf` or `.world` file** - syntax highlighting activates automatically
2. **Start typing** - enjoy intelligent code completion
3. **Hover over elements** - see documentation and examples
4. **Format document** - Use `Shift+Alt+F` for automatic formatting

---

## 📖 SDF Language Reference

### Supported File Extensions
- `.sdf` - Standard SDF files
- `.world` - Gazebo world files

### Core Elements
```xml
<?xml version="1.0" ?>
<sdf version="1.9">
  <world name="my_world">
    <model name="my_robot">
      <link name="base_link">
        <visual name="visual">
          <geometry>
            <box><size>1 1 1</size></box>
          </geometry>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

### Validation Rules
- ✅ `<sdf>` must have `version` attribute
- ✅ `<world>`, `<model>`, `<link>` must have `name` attribute
- ✅ `<joint>` must have `name` and `type` attributes
- ✅ Joint types: `revolute`, `prismatic`, `ball`, `universal`, `fixed`, `continuous`
- ✅ Sensor types: `camera`, `ray`, `lidar`, `imu`, `gps`, `contact`, `force_torque`

---

## ⚙️ Extension Settings

This extension contributes the following settings:

| Setting | Description | Default |
|---------|-------------|---------|
| `sdf.validation.enabled` | Enable/disable SDF validation | `true` |
| `sdf.completion.enabled` | Enable/disable auto-completion | `true` |
| `sdf.formatting.enabled` | Enable/disable auto-formatting | `true` |
| `sdf.hover.enabled` | Enable/disable hover documentation | `true` |

---

## 🛠️ Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `SDF: Validate Document` | Manually validate current SDF file | `Ctrl+Shift+V` |
| `SDF: Format Document` | Format current SDF file | `Shift+Alt+F` |
| `SDF: Show Element Documentation` | Show documentation for element under cursor | `F1` |

---

## 🎯 Use Cases

### 🤖 **Robotics Development**
- **Gazebo simulations** - Create complex robot models and worlds
- **ROS integration** - SDF files for robot descriptions
- **Multi-robot systems** - Coordinate multiple robots in simulation

### 🏭 **Industrial Automation**
- **Factory simulations** - Model production lines and equipment
- **Digital twins** - Create virtual representations of real systems
- **Training environments** - Safe testing of automation systems

### 🎮 **Game Development**
- **Physics simulations** - Realistic object interactions
- **Procedural worlds** - Generate dynamic environments
- **Educational games** - Interactive physics demonstrations

---

## 🐛 Known Issues

- **Large files (>10MB)** may experience slower syntax highlighting
- **Complex nested structures** might have occasional completion delays
- **Custom plugins** require manual schema updates

> 💡 **Tip:** For better performance with large files, consider splitting complex models into separate files and using `<include>` tags.

---

## 🚧 Roadmap

### Version 1.1.0 (Next Release)
- [ ] **Schema validation** against official SDF specification
- [ ] **Live preview** integration with Gazebo
- [ ] **Snippet library** for common robot components
- [ ] **Multi-file refactoring** support

### Version 1.2.0 (Future)
- [ ] **Visual editor** for basic SDF elements
- [ ] **3D preview** integration
- [ ] **Git integration** with diff visualization
- [ ] **Performance optimizations** for large files

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Report Issues**
- Use the [GitHub Issues](https://github.com/your-username/simulation-description-format/issues) page
- Include SDF file samples and VS Code version
- Describe expected vs actual behavior

### 💻 **Development**
```bash
# Clone the repository
git clone https://github.com/your-username/simulation-description-format
cd simulation-description-format

# Install dependencies
npm install

# Run tests
npm test

# Package extension
npm run package
```

### 📝 **Documentation**
- Improve SDF element documentation
- Add usage examples and tutorials
- Translate to other languages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open Source Robotics Foundation** for the SDF specification
- **Gazebo team** for robotics simulation platform
- **VS Code team** for the excellent extension APIs
- **Community contributors** who help improve this extension

---

## 📊 Statistics

<p align="center">
  <img src="https://img.shields.io/badge/Files%20Supported-2%20types-blue" alt="File Types">
  <img src="https://img.shields.io/badge/Elements%20Recognized-50%2B-green" alt="Elements">
  <img src="https://img.shields.io/badge/Validation%20Rules-25%2B-orange" alt="Rules">
  <img src="https://img.shields.io/badge/Auto%20Complete-100%2B%20items-purple" alt="Completion">
</p>

---

<p align="center">
  <strong>Made with ❤️ for the robotics community</strong><br>
  <em>Happy coding! 🤖</em>
</p>