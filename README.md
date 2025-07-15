# SDF Language Support for VS Code

![SDF Extension](https://img.shields.io/badge/SDF-Language%20Support-orange)
![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue)
![Robotics](https://img.shields.io/badge/Robotics-Simulation-green)

Professional language support for **SDF (Simulation Description Format)** files used in robotics simulation frameworks like Gazebo, ROS, and Isaac Sim.

## 🚀 Features

### ✨ **Smart Language Support**
- **Syntax Highlighting** - Robotics-themed colors for world, model, link, joint elements
- **Auto-completion** - Context-aware suggestions for SDF elements and attributes
- **Error Detection** - Real-time validation of SDF structure and schema
- **Hover Documentation** - Instant help for SDF elements and attributes
- **Code Formatting** - Professional XML/SDF formatting

### 🤖 **Robotics-Specific Features**
- **Joint Type Validation** - Validates revolute, prismatic, ball, universal, fixed, continuous
- **Sensor Type Support** - Camera, LIDAR, IMU, GPS, contact, force_torque sensors
- **Schema Validation** - Ensures proper nesting and required attributes
- **File Icons** - Custom icons for `.sdf` and `.world` files

### 🎯 **Smart Completions**
- Context-aware element suggestions based on parent tags
- Required attribute hints (name, type, version)
- Common robotics snippets (inertial properties, visual/collision geometry)
- Joint and sensor type auto-completion

## 📸 Screenshots

### Syntax Highlighting
![Syntax Highlighting](images/syntax-highlighting.png)

### Auto-completion
![Auto-completion](images/auto-completion.png)

### Error Detection
![Error Detection](images/error-detection.png)

## 🛠 Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "SDF Language Support"
4. Click Install

## 📖 Usage

### Supported File Types
- `.sdf` - SDF model and world files
- `.world` - Gazebo world files

### Quick Start
1. Open or create an `.sdf` file
2. Start typing `<` to see auto-completion suggestions
3. Hover over elements for documentation
4. Check the Problems panel for validation errors

### Example SDF File
```xml
<?xml version="1.0" ?>
<sdf version="1.9">
  <world name="default">
    <model name="box">
      <pose>0 0 0.5 0 0 0</pose>
      <link name="link">
        <inertial>
          <mass>1.0</mass>
          <inertia>
            <ixx>0.083</ixx>
            <iyy>0.083</iyy>
            <izz>0.083</izz>
            <ixy>0</ixy>
            <ixz>0</ixz>
            <iyz>0</iyz>
          </inertia>
        </inertial>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </visual>
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
      </link>
    </model>
  </world>
</sdf>
```

## 🎮 Commands

- `SDF: Format Document` - Format current SDF file
- `SDF: Validate Document` - Run validation and show results

## ⚙️ Configuration

The extension works out of the box with default settings. File association is automatic for `.sdf` and `.world` files.

## 🤝 Contributing

Found a bug or want to contribute? 

- **Issues**: [GitHub Issues](https://github.com/Nditah/simulation-description-format/issues)
- **Source**: [GitHub Repository](https://github.com/Nditah/simulation-description-format)

## 📋 Requirements

- VS Code 1.74.0 or higher
- No additional dependencies required

## 🆕 Release Notes

### 1.0.0
- Initial release
- Syntax highlighting for SDF elements
- Auto-completion with context awareness  
- Real-time error detection and validation
- Hover documentation for elements and attributes
- Custom file icons for `.sdf` and `.world` files
- Document formatting support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SDF specification by [Open Source Robotics Foundation](https://osrf.org/)
- Gazebo simulation framework
- ROS (Robot Operating System) community

---

**Made with ❤️ for the robotics community**